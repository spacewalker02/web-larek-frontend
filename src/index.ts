import './scss/styles.scss';
import { LarekApi } from './components/base/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { CatalogModel } from './components/base/CatalogModel';
import { App, ProductListView } from './components/App';
import { CardPreview } from './components/CardPreview';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { BasketModel } from './components/base/BasketModel';
import { BasketView } from './components/BasketView';
import { OrderView } from './components/OrderView';
import { ContactsView } from './components/ContactsView';
import { Success } from './components/common/Success';
import { OrderModel } from './components/base/OrderModel';

const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new LarekApi(CDN_URL, API_URL);
const model = new CatalogModel(events);
const modal = new Modal(document.querySelector('.modal'), events);
const basket = new BasketModel(events);
const order = new OrderModel;

const catalogContainer = document.querySelector('.gallery') as HTMLElement;
export const template = document.querySelector<HTMLTemplateElement>('#card-catalog');

const previewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview');
const cardPreview = new CardPreview(previewTemplate, events);

const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket');
const basketView = new BasketView(basketTemplate, events);

const orderTemplate = document.querySelector<HTMLTemplateElement>('#order');
const orderView = new OrderView(orderTemplate, events);

const contactsTemplate = document.querySelector<HTMLTemplateElement>('#contacts');
const contactsView = new ContactsView(contactsTemplate, events);

const successTemplate = document.querySelector<HTMLTemplateElement>('#success');
const successView = new Success(successTemplate, events);


const view = new ProductListView(catalogContainer, events, template);
const app = new App(api, model, view, modal, cardPreview, events, basket, page, basketView, orderView, contactsView, successView, order);

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });