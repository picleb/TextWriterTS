/**
 * TextWriter - Write a text with a delay between each character.
 *
 * @version 1.0.0
 * @author Pierre Lebedel
 * @license MIT
 * @copyright 2020-02-21
 */

class TextWriter{
	private textDestinationContainer: HTMLElement = undefined; //HTMLElement in which we write the text into
	private animationDelay: number = 100;	//Sleep delay after writing a character during the animation
	private htmlWrapperTag: string = null;	//HTML tag used to wrap the string to write during the animation. Ex: 'p'
	private scrollToTextEnabled: boolean = false; //If set to true, we will scroll to show the text after writing each character


	/**
	 * TextWriter's constructor
	 *
	 * @param destinationId - Html id tag of element we will write into
	 */
	constructor(destinationId: string, scrollToTextEnabled: boolean = false) {
		this.setDestination(destinationId);
		this.scrollToTextEnabled = scrollToTextEnabled;
	}

	/**
	 * Set the texts destination Element in this.textDestinationContainer
	 *
	 * @param destinationId - Html id tag of element we will write into
	 */
	public setDestination(destinationId: string): void {
		this.textDestinationContainer = document.getElementById(destinationId);
	}

	/**
	 * Set the animationDelay, the sleep delay between each character in ms
	 *
	 * @param animationDelay - The sleep delay between each character in ms
	 */
	public setAnimationDelay(animationDelay: number): void {
		this.animationDelay = animationDelay;
	}

	/**
	 * Set the htmlWrapperTag, tag used to wrap characters during the animation. Ex: 'span'
	 * If set TextWriter.write('hi'), will write to the DOM: <span>h</span><span>i</span>
	 *
	 * @param htmlWrapperTag - The HTML tag used to wrap characters. Ex: 'span'
	 */
	public setHtmlWrapperTag(htmlWrapperTag: string): void {
		this.htmlWrapperTag = htmlWrapperTag;
	}

	/**
	 * Create a wrapper element for the string to write and
	 * returns the HTMLElement we will actually write into.
	 *
	 * @returns HTMLElement that will receive the text to write
	 */
	private getTargetElement(): HTMLElement {
		let targetElement: HTMLElement = this.textDestinationContainer;

		if(this.htmlWrapperTag) {
			this.textDestinationContainer.insertAdjacentHTML('beforeend', `<${this.htmlWrapperTag}></${this.htmlWrapperTag}>`);
			targetElement = document.querySelector('#' + this.textDestinationContainer.id + ` ${this.htmlWrapperTag}:last-of-type`);
		}

		return targetElement;
	}

	/**
	 * Allow you to write a JSON element from a JSON argument or a string
	 * inside a <pre> HTML element.
	 *
	 * @remarks
	 * You can only use this method to write JSON like content.
	 *
	 * @param text - A JSON or JSON like element to write in the page
	 * @param animationMultiplier - Allows yo to speed up or slow down the speed of the animation
	 * @returns a Promise
	 */
	public async writeJson(text: string|JSON|Event, animationMultiplier:number = 0.4): Promise<any> {
		let toWrite: string|JSON|Event = text;

		if(typeof toWrite == 'string')
			toWrite = JSON.parse(toWrite);

		toWrite = JSON.stringify(toWrite, null, 2);
		this.textDestinationContainer.insertAdjacentHTML('beforeend', '<pre></pre>');
		const targetElement: HTMLElement = this.textDestinationContainer.querySelector('pre:last-of-type');

		for(let i = 0; i < toWrite.length; i++) {
			await this.sleepAnimationDelay(animationMultiplier);

			this.writeChar(toWrite.charAt(i), targetElement);
		}
	}

	/**
	 * Write any string or array of strings in the target HTMLElement or the TextWriter
	 *
	 * @remarks
	 * You can use this method to write any kind of content. All chars are going to be wrapped in a <span>
	 *
	 * @param text - A string or array of strings to write in the page
	 * @param animationMultiplier - Allows yo to speed up or slow down the speed of the animation
	 * @param delay - A sleep delay before starting the animation process
	 * @param replace - If set to true, the container will be emptied before writing the new text
	 * @returns a Promise
	 */
	public async write(text: string|Array<string>, animationMultiplier:number = 1, delay:number = 0, replace: boolean = false): Promise<any> {
		let toWrite: string|Array<string> = text;

		if(delay) {
			await new Promise(r => setTimeout(r, delay));
		}

		if(typeof toWrite == 'object') {
			for(var x in toWrite) {
				await this.write(toWrite[x], animationMultiplier, 0, replace);
			}
		}
		else {
			const targetElement: HTMLElement = this.getTargetElement();

			if(replace) {
				targetElement.innerHTML = '';
			}

			for(let i = 0; i < toWrite.length; i++) {
				await this.sleepAnimationDelay(animationMultiplier);

				this.writeHtmlChar(toWrite.charAt(i), targetElement);
			}
		}
	}

	/**
	 * Temporarily disable animations. Use this to finish writing immeditely
	 * anything that is currently being written.
	 *
	 * @returns a Promise
	 */
	public async skipAnimation(): Promise<any> {
		const delay = this.animationDelay;
		this.animationDelay = 0;
		await new Promise(r => setTimeout(r, delay));
		this.animationDelay = delay;
	}

	/**
	 * Write one character wrapped in a <span> inside the targeted element 
	 * and makes sure the container is scrolled all the way down.
	 *
	 * @remarks
	 * Maybe you should adapt the scroll behavior this to your text container ?
	 *
	 * @param char - A character to write
	 * @param target - Where the character has to be written
	 */
	private writeHtmlChar(char: string, target: HTMLElement): void {
		target.insertAdjacentHTML('beforeend', `<span>${char}</span>`);
		this.scrollToText();
	}

	/**
	 * Write one character inside the targeted element 
	 * and makes sure the container is scrolled all the way down.
	 *
	 * @param char - A character to write
	 * @param target - Where the character has to be written
	 */
	private writeChar(char: string, target: HTMLElement): void {
		target.insertAdjacentText('beforeend', `${char}`);
		this.scrollToText();
	}

	/**
	 * Scrolls the parent of the text destination container all the way down
	 *
	 * @remarks
	 * Maybe you should adapt the scroll behavior to your context ?
	 * FIXME: This needs some improvement for flexibility
	 * 
	 */
	private scrollToText() {
		if(this.scrollToTextEnabled) {
			this.textDestinationContainer.scrollIntoView();
		}
	}

	/**
	 * Sleeps by this.animationDelay * multiplier milliseconds
	 *
	 * @remarks
	 * If this.animationDelay * multiplier = 0, we skip the Sleep / setTimeout / Promise thing
	 *
	 * @param multiplier - A multiplier to speed up or slow down the animation
	 * @returns true if we skip the animation or a Promise
	 */
	private sleepAnimationDelay(multiplier: number = 1): boolean|Promise<any> {
		if(this.animationDelay * multiplier == 0) {
			return true;
		}
		return new Promise(resolve => setTimeout(resolve, this.animationDelay * multiplier));
	}
}

export { TextWriter };
