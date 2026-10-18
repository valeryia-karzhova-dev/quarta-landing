import Image from 'next/image';
import RoastTag from '@/components/RoastTag';
import LeadForm from '@/components/LeadForm';

export default function Home() {
  return (
    <>
<header className="w"><div className="hd"><a className="logo" href="#top" aria-label="Кварта, наверх"><svg viewBox="0 0 36 36" width="40" height="40" aria-hidden="true"><path d="M18 18V2a16 16 0 0 1 16 16z" fill="#73785B"/><circle cx="18" cy="18" r="16" fill="none" stroke="#4F3228" strokeWidth="2.5"/><g transform="rotate(35 18 18)"><ellipse cx="18" cy="18" rx="6.5" ry="10" fill="#4F3228"/><path d="M18 8.5C14 13 22 23 18 27.5" fill="none" stroke="#E6D5BF" strokeWidth="1.8" strokeLinecap="round"/></g></svg>Кварта</a><nav className="nv" aria-label="Разделы"><a href="#coffee">Сорта</a><a href="#sub">Подписка</a><a href="#week">Неделя</a><a href="#faq">Вопросы</a></nav><a className="tel" href="tel:+375290000000">+375 29 000-00-00</a></div></header>
<main id="top">
<div className="w hero">
 <div><h1>Кофе, который жарили на этой неделе</h1>
 <p>Мы небольшая обжарка в Минске. Жарим в четверг, в пятницу развозим. Зерно приходит к вам на 1–3 день после обжарки.</p>
 <div className="cta"><a className="btn" href="#order">Заказать кофе</a><a className="btn o" href="#coffee">Смотреть сорта</a></div></div>
 <div className="art"><Image src="/hero.jpg" width={880} height={880} alt="Свежеобжаренные зёрна в барабане обжарочной машины" priority sizes="(min-width: 800px) 440px, 100vw" /><RoastTag /></div>
</div>
<div className="w"><div className="facts">
 <div><b>с 2019</b><span>жарим в Минске</span></div><div><b>5 кг</b><span>одна партия</span></div>
 <div><b>четверг</b><span>день обжарки</span></div><div><b>1–3 день</b><span>и зерно у вас</span></div></div></div>

<section><div className="w two"><div><h2>Почему мы так следим за свежестью</h2>
 <p>Кофе вкуснее всего в первые недели после обжарки: аромат яркий, вкус чистый. Пачка с полки может быть обжарена давно, и вы об этом не узнаете. На нашей бирке всегда дата.</p></div>
 <div><h3>Аня и Дмитрий</h3><p>Мы раньше работали бариста и знаем, как отличается свежий кофе от лежалого. Жарим партиями по 5 кг, столько, сколько успеваем раздать за неделю.</p></div></div></section>

<section id="coffee"><div className="w"><h2>Что мы жарим</h2>
 <div className="row"><div><h3>Эфиопия Иргачеффе</h3><p>Цветочный, бергамот, светлая обжарка. 250 г</p></div><span className="pr">32 BYN</span><a className="btn o" href="#order" data-i="Разовый заказ" data-n="Эфиопия Иргачеффе, 250 г">Хочу</a></div>
 <div className="row"><div><h3>Колумбия Уила</h3><p>Карамель, красное яблоко. 250 г</p></div><span className="pr">29 BYN</span><a className="btn o" href="#order" data-i="Разовый заказ" data-n="Колумбия Уила, 250 г">Хочу</a></div>
 <div className="row"><div><h3>Бразилия Серрадо</h3><p>Орех, шоколад, под эспрессо. 250 г</p></div><span className="pr">26 BYN</span><a className="btn o" href="#order" data-i="Разовый заказ" data-n="Бразилия Серрадо, 250 г">Хочу</a></div>
 <div className="row"><div><h3>Дрип-пакеты, ассорти</h3><p>10 штук: заварить можно в чашке, без кофеварки</p></div><span className="pr">18 BYN</span><a className="btn o" href="#order" data-i="Разовый заказ" data-n="Дрип-пакеты, 10 шт.">Хочу</a></div></div></section>

<section id="sub"><div className="w"><div className="sub"><h2>Подписка: свежая пачка каждый месяц</h2>
 <p>Две пачки по 250 г раз в месяц. Сорта подберём по звонку. Доставка бесплатно.</p>
 <div className="pr">54 BYN в месяц</div><a className="btn" href="#order" data-i="Подписка">Хочу подписку</a></div></div></section>

<section id="week"><div className="w"><h2>Как проходит неделя</h2>
 <div className="wk"><div><h3>Четверг</h3><p>Жарим партию. Заказ, который успел к этому дню, едет с ней.</p></div>
 <div><h3>Пятница</h3><p>Развозим по Минску. От 50 BYN доставка бесплатно.</p></div>
 <div><h3>1–3 день</h3><p>Самый вкусный момент.</p></div></div></div></section>

<section><div className="w two"><div className="box"><h3>Доставка</h3><p>По Минску, по пятницам. Бесплатно от 50 BYN, при меньшей сумме стоимость назовёт менеджер.</p></div>
 <div className="box"><h3>Самовывоз</h3><p>Минск, ул. Короля, 9.<br />Пн–пт 8:00–20:00, сб–вс 10:00–18:00.<br /><a href="https://yandex.by/maps/?text=Минск, ул. Короля, 9" rel="noopener">Открыть на карте</a></p></div></div></section>

<section id="faq"><div className="w"><h2>Частые вопросы</h2>
 <details><summary>Какой сорт взять?</summary><p>Для эспрессо подойдёт Бразилия. Эфиопия и Колумбия хороши в воронке и других фильтрах. Напишите в комментарии, как вы завариваете, и мы подскажем.</p></details>
 <details><summary>Как хранить кофе?</summary><p>В закрытой пачке, в сухом и тёмном месте. Лучше выпить за пару недель, пока он вкусный.</p></details>
 <details><summary>Как работает подписка?</summary><p>Две пачки по 250 г в месяц, доставка бесплатно. Сорта и удобный день уточнит менеджер по телефону.</p></details>
 <details><summary>Что, если я заказал после четверга?</summary><p>Менеджер назовёт ближайшую обжарку и дату доставки, когда позвонит.</p></details></div></section>

<section id="order"><div className="w"><h2>Оставить заявку</h2><LeadForm /></div></section>
</main>
<footer><div className="w"><div><h3>Кварта</h3><p className="m">Обжарка в Минске. Жарим в четверг, развозим в пятницу.</p></div>
<div><h4>Связаться</h4><p><a href="tel:+375290000000">+375 29 000-00-00</a></p><p><a href="https://t.me/kvarta_roast">Telegram</a></p><p><a href="https://instagram.com/kvarta.roast">Instagram</a></p></div>
<div><h4>Мастерская</h4><p>Минск, ул. Короля, 9</p><p><a href="https://yandex.by/maps/?text=Минск, ул. Короля, 9" rel="noopener">Показать на Яндекс Картах</a></p><p className="m">Пн–пт 8:00–20:00<br />Сб–вс 10:00–18:00</p></div></div></footer>
    </>
  );
}
