import { LarekApi } from './base/LarekApi';
import { CatalogModel } from './base/CatalogModel';
import { Card } from './Card';
import { formatPrice } from '../utils/utils';
import { IEvents } from './base/events';
import { IForm, IOrder, IOrderResponse, IProduct, IUser } from '../types';
import { Modal } from './common/Modal';
import { CardPreview } from './CardPreview';
import { template } from '..';
import { BasketModel } from './base/BasketModel';
import { Page } from './Page';
import { BasketView } from './BasketView';
import { OrderView } from './OrderView';
import { ContactsView } from './ContactsView';
import { Success } from './common/Success';
import { OrderModel } from './base/OrderModel';
import { BasketViewItem } from './BasketViewItem';

export class ProductListView {
    constructor(
      private container: HTMLElement,
      private events: IEvents,
      private template: HTMLTemplateElement
    ) {}
  
    render(items: IProduct[]) {
      this.container.innerHTML = '';
  
      items.forEach((item) => {
        const cardFragment = template.content.cloneNode(true) as HTMLElement;
        const cardEl = cardFragment.querySelector('.card') as HTMLElement;
        const card = new Card(cardEl, this.events);
        card.render(item);
        this.container.appendChild(cardEl);
      });
    }
  }

  
  export class App {
    constructor(
      private api: LarekApi,
      private catalog: CatalogModel,
      private view: ProductListView,
      private modal: Modal,
      private cardPreview: CardPreview,
      private events: IEvents,
      private basket: BasketModel,
      private page: Page,
      private basketView: BasketView,
      private orderView: OrderView,
      private contactsView: ContactsView,
      private successView: Success,
      private orderModel: OrderModel,
      private basketItemTeplate: HTMLTemplateElement
    ) {}
  
    init() {
      this.api.getItemList()
        .then((items) => {
          this.catalog.setItems(items);
          this.view.render(items);
        })
        .catch(console.error);

        this.events.on('item:preview', (data: { id: string }) => {
            const product = this.catalog.getItemById(data.id);
            const isInBasket = this.basket.getItems().includes(product.id);
            this.cardPreview.render(product);   
            this.cardPreview.setInBasketState(isInBasket);
            this.modal.content = this.cardPreview.getElement();
            this.modal.open();
          });

        this.events.on('basket:add', (data: { id: string }) => {
            const added = this.basket.addItem(data.id);
            if (added) {
                this.updateCounter();
                this.cardPreview.setInBasketState(true);
            }
        });

        this.events.on('basket:open', () => {
            this.basketView.items = this.renderBasketItems();
            this.modal.content = this.basketView.getElement();
            this.modal.open();
        });

        this.events.on('basket:remove', (data: { id: string }) => {
            this.basket.removeItem(data.id);
            this.basketView.items = this.renderBasketItems();
            this.updateCounter();         
            this.basketView.disabled = this.basket.getItems().length === 0;
        });

        this.events.on('order: submit', () => {
          this.modal.content = this.orderView.render();
          this.modal.open();
        });

        this.events.on('form:errors', (data: { errors: string; isValid: boolean }) => {
          this.orderView.showError(data.errors);
          this.orderView.setSubmitBtnDisabled(!data.isValid);
        });

        this.events.on('order:next', (data: IForm) => {
          this.orderModel.setForm(data);
          this.modal.content = this.contactsView.render();
          this.modal.open();
        });

        this.events.on('order:complete', (user: IUser) => {
          const items = this.basket.getItems();

          this.orderModel.setUser(user);
          this.orderModel.setItems(items);

          const basketItems = items.map((id) => this.catalog.getItemById(id));
          const total = basketItems.reduce((sum, item) => sum + (item?.price ?? 0), 0);

          this.orderModel.setTotal(total);

          const order = this.orderModel.getOrder();
          if (!order) return;

          this.api.createOrder(order)
          .then((response: IOrderResponse) => {
            this.successView.total = total;
            this.modal.content = this.successView.render();
            this.modal.open();
            
            this.basket.clear();
            this.updateCounter();
            this.orderModel.clear();
          })
          .catch((error) => {
            console.error("Ошибка при оформлении заказа:", error);
          });
        });

          this.events.on('modal:close', () => {
            this.modal.close();
          });

          this.events.on('contacts: change', (data: IUser) => {
            const errors = this.orderModel.validateContacts(data);

            if (errors.length > 0) {
              this.contactsView.showError(errors.join('. ') + '.');
              this.contactsView.setSubmitBtnDisabled(true);
            } else {
              this.contactsView.showError('');
              this.contactsView.setSubmitBtnDisabled(false);
            }

            this.orderModel.setUser(data);
          })

          this.events.on('address: change', (data: { address: string }) => {
            this.orderModel.setAddress(data.address);
            this.emitOrderFormValidationResult();
          });
          
          this.events.on('payment: change', (data: { payment: 'card' | 'cash' }) => {
            this.orderModel.setPayment(data.payment);
            this.emitOrderFormValidationResult();
          });
          
          this.events.on('form:errors', (data: { errors: string; isValid: boolean }) => {
            this.orderView.showError(data.errors);
            this.orderView.setSubmitBtnDisabled(!data.isValid);
          });
    }

    private renderBasketItems(): HTMLElement[] {
      const basketData = this.basket.getItems().map((id) =>
        this.catalog.getItemById(id)
      );
    
      return basketData.map((item, index) => {
        const view = new BasketViewItem(this.basketItemTeplate, item, index, this.events);
        return view.render();
      });
    }

    updateCounter() {
        this.page.counter = this.basket.getItems().length;
    }

    private emitOrderFormValidationResult(): void {
      const errors = this.orderModel.validate();
      this.events.emit('form:errors', {
        errors: errors.length ? errors.join('. ') + '.' : '',
        isValid: errors.length === 0,
      });
    }
  }