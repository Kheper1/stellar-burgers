import * as orderFixture from '../fixtures/order.json';

const testURL = 'http://localhost:4000';

const selectors = {
  bun: '[data-cy="bun"]',
  bunFirst: '[data-cy="bun"]:first-of-type',
  mainOrSauce: '[data-cy="main"], [data-cy="sauce"]',
  main: '[data-cy="main"]',
  sauce: '[data-cy="sauce"]',
  orderButton: '[data-cy-order]',
  modals: '#modals',
  constructorTop: 'div.constructor-element_pos_top',
  constructorRows: 'span.constructor-element__row',
};

describe('Тест бургерной', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit(testURL);
  });

  it('Проверка загрузки страницы', () => {
    cy.url().should('eq', testURL + '/');
  });

  it('Проверка ингредиентов', () => {
    cy.get(selectors.bun).should('have.length.at.least', 1);
    cy.get(selectors.mainOrSauce).should('have.length.at.least', 1);
  });

  describe('Тест добавление ингредиентов в конструктор', () => {
    it('Проверка совпадения названий ингредиентов после добавления', () => {
      // Булка
      cy.get(selectors.bunFirst)
        .find('p.text_type_main-default')
        .invoke('text')
        .then((bunName) => {
          cy.get(`${selectors.bunFirst} button`).click();
          cy.get(selectors.constructorTop)
            .find('.constructor-element__text')
            .should('contain.text', bunName.trim());
        });

      // Начинка (первый элемент)
      cy.get(`${selectors.main}:first-of-type`)
        .find('p.text_type_main-default')
        .invoke('text')
        .then((mainName) => {
          cy.get(`${selectors.main}:first-of-type button`).click();
          cy.get(selectors.constructorRows)
            .eq(1)
            .find('.constructor-element__text')
            .should('contain.text', mainName.trim());
        });

      // Соус (первый элемент)
      cy.get(`${selectors.sauce}:first-of-type`)
        .find('p.text_type_main-default')
        .invoke('text')
        .then((sauceName) => {
          cy.get(`${selectors.sauce}:first-of-type button`).click();
          cy.get(selectors.constructorRows)
            .eq(2)
            .find('.constructor-element__text')
            .should('contain.text', sauceName.trim());
        });
    });
  });

  describe('Тест модальных окон', () => {
    beforeEach(() => {
      cy.get(selectors.bunFirst).click();
      cy.get(selectors.modals).children().should('have.length', 2);
    });

    it('Соответствие ингредиента в модальном окне', () => {
      cy.get(selectors.bunFirst)
        .find('p.text_type_main-default')
        .first()
        .invoke('text')
        .then((ingredientName) => {
          cy.get(`${selectors.modals} h3`)
            .eq(1)
            .invoke('text')
            .should('contain', ingredientName.trim());
        });
    });

    it('Открытие модального окна после перезагрузки', () => {
      cy.reload(true);
      cy.get(selectors.modals).children().should('have.length', 2);
    });

    describe('Закрытие модального окна', () => {
      it('Нажимаем крестик', () => {
        cy.get(`${selectors.modals} button:first-of-type`).click();
        cy.get(selectors.modals).children().should('have.length', 0);
      });

      it('Нажимаем оверлэй', () => {
        cy.get(`${selectors.modals} > div:nth-of-type(2)`).click({ force: true });
        cy.get(selectors.modals).children().should('have.length', 0);
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit(testURL);
    });

    it('Успешное оформление заказа', () => {
      cy.get(selectors.orderButton).should('be.disabled');

      cy.get(`${selectors.bunFirst} button`).click();
      cy.get(selectors.orderButton).should('be.disabled');

      cy.get(`${selectors.main}:first-of-type button`).click();
      cy.get(selectors.orderButton).should('be.enabled');

      cy.get(selectors.orderButton).click();

      cy.get(selectors.modals).children().should('have.length', 2);
      cy.get(`${selectors.modals} h2:first-of-type`).should(
        'have.text',
        orderFixture.order.number
      );

      cy.get(`${selectors.modals} button:first-of-type`).click();

      cy.get(selectors.orderButton).children().should('have.length', 0);
      cy.get(selectors.orderButton).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
