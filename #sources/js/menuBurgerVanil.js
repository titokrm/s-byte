'use strict'
/*********************************************************************/
// меню должно иметь примерно такой вид, блок .js-slideblock в моб виде будет ездить
//      <header class="header">
//        <nav class="header__nav menu js-slideblock">
//          <button class="js-close-menu menu__close"><img src="images/icon-close.svg" alt=""></button>  
//          <ul class="menu__list">
//            <li class="active"><a href="#">Бизнес</a></li>
//            <li><a href="#">О нас</a></li>
//            <li><a href="#">Цены</a></li>
//            <li><a href="#">Оформить заказ</a></li>
//          </ul>
//        </nav>
//        <button class="js-show-menu header__burger"><img src="images/icon-burger.svg" alt=""></button>
//      </header>
//  для меню бургер и для отключ скролла с компенсацией ширины скролла 
// необходимо обертывание ВСЕГО содержимого body в .wrapper-global
/*********************************************************************/
// Заблокировать прокрутку страницы
function lockScroll(headerSelector = null, addHeaderPadding = false){
  let heightScreen = document.documentElement.clientHeight;
  let heightBodyInner = document.querySelector('.wrapper-global').offsetHeight;
	if (!body.classList.contains('scroll-lock') && heightBodyInner > heightScreen) {
    //    console.log('закрываем скролл');
    scrollLocked = true;    
		let bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.classList.add('scroll-lock');
		body.style.top = `-${bodyScrollTop}px`;
    body.dataset.scrollTop = bodyScrollTop;
    oldStyleHeader = document.querySelector(headerSelector)?.getAttribute('style');
    if (headerSelector !== null && addHeaderPadding && window.innerWidth <= mobWidth) {
      document.querySelector(headerSelector)?.setAttribute('style', (oldStyleHeader === null ? '' : (oldStyleHeader + ';')) + `padding-right: ${scrollWidth}px`);
    }
	};
}

// Включить прокрутку страницы
function unlockScroll(headerSelector = null, addHeaderPadding = false){
  //debugger;
	if (body.classList.contains('scroll-lock')) {
		body.classList.remove('scroll-lock');
		body.style.top = null;
    let bodyScrollTop = +body.dataset.scrollTop;
    delete body.dataset.scrollTop;
		window.scroll(0, bodyScrollTop);
    setTimeout(() => {
      scrollLocked = false;
    }, 1);
    if (headerSelector !== null && addHeaderPadding) {
      document.querySelector(headerSelector)?.setAttribute('style', oldStyleHeader === null ? '' : oldStyleHeader);
    }    
	}
}

function getWidthScroll() {
  let div = document.createElement('div');

  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.append(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;

  div.remove();
  return scrollWidth;
}

let body = document.getElementsByTagName('body')[0];
let scrollWidth = getWidthScroll();
let oldStyleHeader = '';
let mobWidth = 980;
let scrollLocked = false;

/******************************************************************************/
// для поведения хедера в стиле адресной строки мобильных браузеров
// и для изменения св-в хедера при скролле 
/******************************************************************************/
function scrollBehaviorHeader(headerSelector = '.header', changePosition = false, changeVisible = false) {
  function actions() {
    if (changePosition) {
      if (nowPositionScrollTop == 0 && !scrollLocked) {
        document.querySelector(headerSelector).classList.remove('header--fixed');
      } else {
        document.querySelector(headerSelector).classList.add('header--fixed');
      }
    }
    if (changeVisible) {
      if ((nowPositionScrollTop > lastPositionScrollTop) && !scrollLocked){
        if (typeof changeVisible !== 'boolean') {
          changeVisible <= nowPositionScrollTop ? document.querySelector(headerSelector).classList.add('header--hidden') : null;
        } else {
          document.querySelector(headerSelector).classList.add('header--hidden');
        }
      } else {        
        document.querySelector(headerSelector).classList.remove('header--hidden');
      }
    }
  }
  if (headerSelector !== null) {
    var lastPositionScrollTop = 0;
    var nowPositionScrollTop = window.scrollY;
    
    lastPositionScrollTop = nowPositionScrollTop;
    actions();
    window.addEventListener('scroll', () => {
      nowPositionScrollTop = window.scrollY;
      actions();
      lastPositionScrollTop = nowPositionScrollTop;      
    });
  }
}

function menuSlide({
  burger = 'js-show-menu', // класс для кнопки бургер
  closeMenu = 'js-close-menu', // класс для кнопки закрытия меню
  menu = 'js-slideblock', // класс для выезжающего блока
  overlay = 'menu__overlay', // класс для оверлея меню
  timeAnimate = 300,
  btnShowSecondLevelMenuSelector = null, // если не нужно показывание второго уровна то null, иначе 
                                         // селектор для элемента-кнопки 
                                         // к примеру '.slideblock .menu-item-has-children > a',
  headerSelector = 'header.header', // селектор хедера
  changePosition = false, // нужно менять сво-ва хедера при скролле с нулевой позиции?
  changeVisible = false,  // нужно поведение хедера в стиле адресной строки мобильных браузеров? можна задать смещение от верха когда такое поведение будет включаться
  mobWidthSetting = 980,
  addHeaderPadding = false // нужно добавлять padding-right хедеру для компенсации полосы прокрутки 
                           // при postion: fixed?
} = {}) {
  mobWidth = mobWidthSetting;
  document.addEventListener('click', (event) => {
    if (event.target.closest('.' + burger)) {
      event.preventDefault();
      const overlayDiv = document.createElement('div');
      overlayDiv.classList = `${overlay} ${closeMenu} active`;
      overlayDiv.style = `position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 40; background-color: #000; opacity: .6;`;
      const menuDiv = document.querySelector('.' + menu);
      menuDiv.parentNode.prepend(overlayDiv);
      menuDiv.classList.toggle('active');
      lockScroll(headerSelector, addHeaderPadding);
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('.' + closeMenu)) {
      event.preventDefault();
      const menuDiv = document.querySelector('.' + menu);
      menuDiv.classList.toggle('active');
      setTimeout(() => {
        document.querySelector('.' + overlay).remove();
        unlockScroll(headerSelector, addHeaderPadding);
      }, timeAnimate);
    }
  });
  if (btnShowSecondLevelMenuSelector !== null) {
    document.addEventListener('click', function(event) {
      if (event.target.closest(btnShowSecondLevelMenuSelector)) {
        event.preventDefault();
        const parentElemLi = event.target.closest('li');
        const subMenuEl = parentElemLi.querySelector('.submenu');
        if (parentElemLi.classList.contains('active')) {          
          subMenuEl.style = `max-height: 0;`
          setTimeout(() => {
            parentElemLi.classList.remove('active');
            subMenuEl.classList.remove('active');
          }, timeAnimate)
        } else {
          parentElemLi.classList.add('active');
          subMenuEl.classList.add('active');
          subMenuEl.style = `max-height: ${subMenuEl.scrollHeight}px;`
        }
      }
    });
  }
  if (changePosition || changeVisible) {
    scrollBehaviorHeader(headerSelector, changePosition, changeVisible);
  }
}
