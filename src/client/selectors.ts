/**
 * Resilient multi-tier CSS and XPath selectors for Tilda Publishing editor interface.
 * Built with fallbacks for interface updates and Russian/English locale variations.
 */

export const SELECTORS = {
  // Page & Editor Canvas
  editor: {
    canvas: '#allrecords',
    records: 'div.record',
    recordById: (recordId: string) => `div#record${recordId}, div[data-record-id="${recordId}"]`,
    loadingSpinner: '.tp-loading, .t-spinner, .tp-preloader',
  },

  // Add Block Buttons
  addBlock: {
    // Empty page initial prompt button
    emptyPageAddBtn: [
      '.tp-empty-page__btn',
      'a:has-text("Добавить блок")',
      'button:has-text("Добавить блок")',
      'a:has-text("Add a block")',
      '.tp-add-record-button',
      '#allrecords .tp-record-edit-icons__plus',
    ],
    // Plus button between records or at the bottom
    plusButtonBottom: [
      '.tp-record-edit-icons__plus_bottom',
      '.tp-add-record-button',
      '.tp-page-add-block-btn',
      'a[title="Добавить блок"]',
      'div[title="Добавить блок"]',
      '.tp-record-edit-icons__plus',
    ],
    // Plus button for a specific record
    plusButtonForRecord: (recordId: string) => [
      `div#record${recordId} .tp-record-edit-icons__plus`,
      `div[data-record-id="${recordId}"] .tp-record-edit-icons__plus`,
      `div#record${recordId} + .tp-add-record-button`,
    ],
  },

  // Library / Block Selection Drawer
  library: {
    container: '.tp-library, #tp-library, .tp-record-library',
    searchInput: [
      'input.tp-search__input',
      'input[placeholder*="Поиск"]',
      'input[placeholder*="поиск"]',
      'input[placeholder*="Search"]',
      'input[placeholder*="search"]',
      '#tp-library input[type="text"]',
    ],
    // Direct category: "Другое" / "Other"
    categoryOther: [
      '[data-menu="other"]',
      '[data-category="other"]',
      '.tp-library__category:has-text("Другое")',
      '.tp-library__category:has-text("Other")',
      'a:has-text("Другое")',
      'div:has-text("Другое")',
    ],
    // Block T123: HTML-код
    blockT123Card: [
      '[data-tpl="123"]',
      '[data-record-tpl="123"]',
      '.tp-library__item:has-text("T123")',
      '.tp-library__item:has-text("HTML-код")',
      '.tp-library__item:has-text("HTML code")',
      'div:has-text("T123")',
      'a:has-text("T123")',
    ],
  },

  // Record action toolbar (Content button)
  recordControls: {
    toolbar: (recordId: string) => `div#record${recordId} .tp-record-edit-icons, div[data-record-id="${recordId}"] .tp-record-edit-icons`,
    contentBtn: (recordId: string) => [
      `div#record${recordId} a.tp-record-edit-icons__btn[data-menu="content"]`,
      `div[data-record-id="${recordId}"] a.tp-record-edit-icons__btn[data-menu="content"]`,
      `div#record${recordId} a:has-text("Контент")`,
      `div[data-record-id="${recordId}"] a:has-text("Контент")`,
      `div#record${recordId} a:has-text("Content")`,
      `div[data-record-id="${recordId}"] a:has-text("Content")`,
      `div#record${recordId} .tp-record-edit-icons__item:first-child`,
    ],
    deleteBtn: (recordId: string) => [
      `div#record${recordId} a.tp-record-edit-icons__btn[data-menu="delete"]`,
      `div[data-record-id="${recordId}"] a.tp-record-edit-icons__btn[data-menu="delete"]`,
    ],
  },

  // Ace Editor / Content Edit Modal
  contentModal: {
    container: [
      '#editrecord',
      '.tp-popup-window',
      '.tp-popup-record-edit',
      '.tp-form-body',
      'div[aria-label*="Контент"]',
    ],
    aceContainer: [
      '.ace_editor',
      '#editor',
      'div[id^="ace_"]',
      '.ace-editor',
      '.tp-form-group .ace_editor',
    ],
    saveAndCloseBtn: [
      'button:has-text("Сохранить и закрыть")',
      'a:has-text("Сохранить и закрыть")',
      'button:has-text("Save and close")',
      'a:has-text("Save and close")',
      '.tp-form-footer__btn_save',
      'button.tp-btn[type="submit"]',
      'input[type="submit"][value*="Сохранить"]',
    ],
    closeModalBtn: [
      '.tp-popup-window__close',
      'button:has-text("Закрыть")',
      'a:has-text("Закрыть")',
      '.tp-popup__close-button',
    ],
  },

  // Publishing Controls
  publish: {
    publishBtn: [
      'a:has-text("Опубликовать")',
      'button:has-text("Опубликовать")',
      'a:has-text("Publish")',
      'button:has-text("Publish")',
      '#publishbtn',
      '.tp-nav__btn_publish',
      'a[href*="/page/publish/"]',
    ],
    publishModal: [
      '.tp-popup-window',
      '#popup-publish',
      '.tp-popup-publish',
      'div[role="dialog"]',
    ],
    publishedPageLink: [
      '.tp-popup-window a[href^="http"]',
      '#popup-publish a[href^="http"]',
      '.tp-popup-publish a[target="_blank"]',
      'a.tp-popup-window__link',
      '.tp-popup-window__url a',
    ],
    publishCloseBtn: [
      '.tp-popup-window__close',
      'button:has-text("Готово")',
      'button:has-text("Done")',
      'a:has-text("Готово")',
    ],
  },

  // Project Dashboard & Page Creation
  project: {
    createNewPageBtn: [
      'a:has-text("Создать новую страницу")',
      'button:has-text("Создать новую страницу")',
      'a:has-text("Create a new page")',
      'button:has-text("Create a new page")',
      'a[href*="/page/?projectid="]',
      '.tp-project-actions__add-page',
    ],
    blankPageTemplate: [
      'a:has-text("Пустая страница")',
      'div:has-text("Пустая страница")',
      'a:has-text("Blank page")',
      'div:has-text("Blank page")',
      '[data-template-id="blank"]',
      '.tp-template-card_blank',
    ],
  },
};
