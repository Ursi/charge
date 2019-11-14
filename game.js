import jsx from './modules/jsx/jsx.js'; jsx.buildIn();
import ElemStr from './modules/ElemStr/ElemStr.js';
import hotkeys from './modules/WebHK/hotkeys.js';

{//debugging
	globalThis.hotkeys = hotkeys;
	globalThis.ElemStr = ElemStr
}

class Level extends ElemStr {
	constructor(size, cps, chars) {
		super('div');
		Object.defineProperties(this, {
			//completeTime:,
			chars: {
				value: chars,
			},
			container: {
				value: document.createElement('div'),
			},
			cps: {
				value: cps,
			},
			//finishTime:,
			listener: {
				value: this.listener.bind(this),
			},
			pace: {
				value: {
					//interval:,
					level: this,
					next() {
						let currentPace = this.level.firstClass('pace');
						currentPace.classList.remove('pace');
						let nextPace = currentPace.nextElementSibling;
						if (nextPace) {
							nextPace.classList.add('pace');
						} else {
							clearInterval(this.interval);
						}
					},
					start() {
						this.next();
						this.interval  = setInterval(()=> this.next(), 1000 / this.level.cps);
					},
				},
			},
			rtTimeout: {
				value: false,
				writable: true,
			},
			size: {
				value: size,
			},
			start: {
				value: this.start.bind(this),
			},
			startTime: {
				value: false,
				writable: true,
			},
		});

		chars.shuffle();
		let elemChar = this.append(chars[0], 'next', 'hidden');
		if (elemChar.textContent == ' ') elemChar.classList.add('space');
		for (let i = 1; i < size; i++) {
			elemChar = this.append(chars[i], 'left', 'hidden');
			if (elemChar.textContent == ' ') elemChar.classList.add('space');
		}

		this.container.id = 'level';
		//this.appendTo(this.container);
		this.container.appendChild(this.fragment);
	}

	finish(){
		let {cps, size, chars} = this;
		window.removeEventListener('keydown', this.listener);
		Object.defineProperty(this, 'finishTime', {value: Date.now()});
		Object.defineProperty(this, 'completeTime', {value: (this.finishTime - this.startTime) / 1000});
		//Object.defineProperty(this, 'nextSize', {value: Math.ceil(size * 1 / cps * size / this.completeTime)});
		Object.defineProperty(this, 'nextSize', {value: Math.ceil(size * (size - 1) / cps / this.completeTime)});
		console.log(size, (size - 1) / cps, this.completeTime);
		if (size == chars.length && this.nextSize > chars.length) {
			this.container.remove();
			start.style.removeProperty('display');
			clearInterval(this.pace.interval);
			hotkeys.active = true;
		} else {
			console.log(Math.max(this.nextSize, 1), chars.length, 3 * size - 1);
			(new Level(Math.min(Math.max(this.nextSize, 2), chars.length, 3 * size - 1), cps, chars)).init();
		}
	}

	init(){
		try{document.getElementById('level').remove();}catch(_){}
		document.querySelector('body').appendChild(this.container);
		//this.listener = this.listener.bind(this);
		window.addEventListener('keydown', this.listener);
	}

	listener(e) {
		if (!this.startTime) {
			this[0].classList.add('pace');
				if (!this.rtTimeout) {
					this.rtTimeout = setTimeout(this.start, Math.max(reactionTime, 1000 / this.cps));
					for (let elem of this) {
						elem.classList.remove('hidden');
					}

					return; //stops the input that unhides the chraracters from counting
				} else {
					clearTimeout(this.rtTimeout);
					this.start();
				}
		}

		if (allChars.includes(e.key)) {
			if (e.key == this.firstClass('next').textContent) {
				this.proceed();
			} else {
				this.mistake();
			}
		}
	}

	mistake(){
		if (this.hasClass('done')) {
			this.firstClass('next').classList.replace('next', 'missed');
			this.lastClass('done').classList.replace('done', 'next');
		}
	}

	proceed(){
		this.firstClass('next').classList.replace('next', 'done');
		this.hasClass('missed') ? nextNext = 'missed' : nextNext = 'left';
		if (this.hasClass('missed')) {
			var nextNext = 'missed';
		} else if (this.hasClass('left')) {
			var nextNext = 'left'
		} else {
			this.finish();
			return;
		}

		this.firstClass(nextNext).classList.replace(nextNext, 'next');
	}

	start(){
		Object.defineProperty(this, 'startTime', {value: Date.now()});
		this.pace.start();
	}
}

const reactionTime = 1000; // ms
const charsStr = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+{}|:"<>?' //no space
var allChars = [];
for (let char of charsStr) {
	allChars.push(char);
	if (char.toUpperCase() != char) allChars.push(char.toUpperCase());
}

const start = document.getElementById('start');
const settings = document.getElementById('settings');
const settingsMenu = document.getElementById('settings-menu');
const smcl = settingsMenu.classList;
const cpsElem = document.getElementById('cps');
const settingsChars = {
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	special: "1234567890[],.'-/\\;=`",
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	upperspecial: '!@#$%^&*(){}<>"_?|:+~',
};

start.addEventListener('click', function(){
	let chars = [];
	for (let elemChar of document.querySelectorAll('.elem-char.selected')) {
		chars.push(elemChar.textContent);
	}

	if (chars.length >= 2) {
		hotkeys.active = false;
		this.style.display = 'none';
		sessionStorage.setItem('chars', JSON.stringify(chars));
		let cps = Math.max(.1, Number(cpsElem.value)).toFixed(1);
		cpsElem.value = cps;
		sessionStorage.setItem('cps', cps);
		(new Level(2, cps, chars)).init();
	} else {
		this.style.color = 'red';
		setTimeout(()=> this.style.removeProperty('color'), 500);
	}
});

{//setup and restore settings
	var chars = JSON.parse(sessionStorage.getItem('chars')) || [];
	for (let [type, string] of Object.entries(settingsChars)) {
		let elemStr = new ElemStr('div', string);
		let container = document.querySelector(`[data-chars='${type}']`);
		let selectAll = document.querySelector(`[data-chars='${type}'].select-all`);
		let selectedCount = 0;
		for (let elemChar of elemStr) {
			if (chars.includes(elemChar.textContent)) {
				elemChar.classList.add('selected');
				selectedCount++;
			}

			container.appendChild(elemChar);
			elemChar.addEventListener('click', function(){
				this.classList.toggle('selected')
				if (document.querySelectorAll(`[data-chars='${type}'] > .elem-char.selected`).length == string.length) {
					selectAll.classList.add('selected');
				} else {
					selectAll.classList.remove('selected');
				}
			});
		}

		if (selectedCount == string.length) selectAll.classList.add('selected');
	}

	cpsElem.value = sessionStorage.getItem('cps') || '1.0';
}
{//sidebar events
	settings.addEventListener('mouseenter', function(){
		transWait(this).then(()=>{
			smcl.add('active');
		});

		this.classList.add('activated');
		this.parentNode.style.zIndex = -1;
	});

	window.addEventListener('click', function(){
		if (smcl.contains('active')) {
			transWait(settingsMenu).then(()=>{
				settings.classList.remove('activated')
				settings.parentNode.style.removeProperty('z-index');
			});

			cpsElem.blur();
			smcl.remove('selecting-chars');
			smcl.remove('active');
		}
	});

	cpsElem.addEventListener('keydown', function(e) {
		//if (/^e$/i.test(e.data)) e.preventDefault();
		if (e.key.toLowerCase() == 'e') e.preventDefault();
	});

	for (let sidebar of document.getElementsByClassName('sidebar')) {
		sidebar.addEventListener('click', function(e) {
			e.stopPropagation();
		});
	}

	for (let div of document.getElementsByClassName('select-all')) {
		div.addEventListener('click', function(){
			if (this.classList.toggle('selected')) {
				var method = 'add';
			} else {
				var method = 'remove';
			}

			let elemChar = this.nextElementSibling
			do {
				elemChar.classList[method]('selected');
			} while (elemChar = elemChar.nextElementSibling);
		});
	}
}
{//hotkeys
	hotkeys.addWith({action: 'up'},
		['Enter', ()=> start.click()],
		[' ', ()=> start.click()]
	);

	hotkeys.add('Escape', ()=>{
		if (cpsElem == document.activeElement) {
			cpsElem.blur();
		} else if (smcl.contains('selecting-chars')) {
			smcl.remove('selecting-chars');
		} else if (smcl.contains('active')) {
			window.dispatchEvent(new Event('click'));
		}
	});

	hotkeys.add('KeyC', e => {
		if (!smcl.contains('active')) {
			settings.dispatchEvent(new Event('mouseenter'));
		}

		if (e.shiftKey) {
			cpsElem.select();
		} else {
			cpsElem.focus();
		}
	}, {context: ()=> !smcl.contains('selecting-chars')});

	hotkeys.add('e', ()=>{
		cpsElem.blur();
		smcl.toggle('selecting-chars');
	},{
		context() {
			return smcl.contains('active') &&
			!smcl.contains('selecting-chars');
		},
		action: 'up',
	});

	hotkeys.add('s', ()=> settings.dispatchEvent(new Event('mouseenter')), {context: ()=> !settings.classList.contains('activated')});
	[
		'lowercase',
		'uppercase',
		'special',
		'upperspecial'
	].forEach((value, index) => hotkeys.add(
		index + 1,
		()=> document.querySelector(`.select-all[data-chars='${value}']`).click(),
		{context:()=>{
			return document.activeElement != cpsElem &&
			!smcl.contains('selecting-chars');
		}}
	));

	window.addEventListener('keydown', function(e) {
		if (
			smcl.contains('selecting-chars') &&
			document.activeElement != cpsElem
		) {
			if (allChars.includes(e.key)) {
				settingsMenu.querySelector(`[data-char='${e.key}']`).click();
			}
		}
	});
}
