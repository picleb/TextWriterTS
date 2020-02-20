# TextWriter - TypeScript type writer
A lightweight library to write a text with a delay between each character


## Installation
Download / clone the TextWriter.ts file in your TypeScript source directory.

Import the module in your working file.

```ts
import { TextWriter } from './TextWriter.js';
```

## Usage
Two main methods are available. `write()`, and `writeJson()`.

```ts
let writer: TextWriter = new TextWriter('text-container');
writer.write('Hello');

// Use default configuration to output 'Hello' with each caracter wrapped in a span HTML tag, 
// with a 100ms sleep delay between each character.
// <span>H</span><span>e</span><span>l</span><span>l</span><span>o</span>
```

## Going further
The `write()` method has the following parameters

- **text** - A string or array of strings to write in the page
- **animationMultiplier** - Allows yo to speed up or slow down the speed of the animation
- **delay** - A sleep delay before starting the animation process
- **replace** - If set to true, the container will be emptied before writing the new text

`text: string|Array<string>, animationMultiplier:number = 1, delay:number = 0, replace: boolean = false`



Use `writeJson` to output JSON or JSON like objects in a `<pre>` format.
The `writeJson()` method has the following parameters

- **text** - A JSON or JSON like element to write in the page
- **animationMultiplier** - Allows yo to speed up or slow down the speed of the animation

`text: string|JSON|Event, animationMultiplier:number = 0.4`

### More advanced examples
```ts
let writer: TextWriter = new TextWriter('text-container');
writer.write('Hello', 2, 2000, true);

// Will write 'Hello', with a 2* factor on the sleep delay (=200ms), 
// after a 2 seconds pause before the first character, and will replace 
// the previous content of the HTMLElement with the id 'text-container'.
```

```ts
let writer: TextWriter = new TextWriter('text-container');
writer.setHtmlWrapperTag('p');
writer.setAnimationDelay(200);
writer.write(['Hello', 'World']);

// Will write 'Hello' then 'World' in two different <p> elements in the id 'text-container', 
// with a 200ms pause between each character.
```

```ts
let writer: TextWriter = new TextWriter('json-container');
writer.writeJson("{'Hello': 'World'}", 0.5);

// Will write {'Hello': 'World'}, with a 0.5 factor on the sleep delay (=50ms) in the HTMLElement 
// with the id 'text-container'.
```