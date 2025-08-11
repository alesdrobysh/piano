// Types remain the same for the public API
type UiHtmlElement = { __uiElement: UiElement } & HTMLElement;
type Attribute = { name: string; value: string };
type Listener = [string, EventListener[]];

export class UiElement {
  #tag: string;
  #element?: UiHtmlElement;
  #attributes: Map<string, string>;
  #listeners: Map<string, EventListener[]>;
  #children: (UiElement | string)[] = [];

  constructor(
    tag: string,
    attributes: Attribute[] = [],
    listeners: Listener[] = [],
    children: UiElement[] | UiElement | string = [],
  ) {
    this.#tag = tag;
    this.#attributes = new Map(attributes.map((attr) => [attr.name, attr.value]));
    this.#listeners = new Map(listeners);
    this.#children = Array.isArray(children) ? children : [children];
  }

  get element() {
    return this.#element;
  }

  setChildren(children: UiElement[]) {
    this.#children = Array.isArray(children) ? children : [children];
    this.render();
    return this;
  }

  setAttributes() {
    this.#attributes.forEach((value, name) => {
      this.#element?.setAttribute(name, value);
    });
  }

  id(id: string) {
    return this.attribute('id', id);
  }

  class(className: string) {
    return this.attribute('class', className);
  }

  attribute(name: string, value: string) {
    this.#attributes.set(name, value);
    this.#element?.setAttribute(name, value);
    return this;
  }

  getAttribute(name: string) {
    return this.#attributes.get(name);
  }

  removeAttribute(name: string) {
    this.#attributes.delete(name);
    this.#element?.removeAttribute(name);
    return this;
  }

  setListeners() {
    this.#listeners.forEach((fns, event) => {
      fns.forEach((fn) => {
        this.#element?.addEventListener(event, fn);
      });
    });
  }

  removeListeners() {
    if (!this.#element) return;
    this.#listeners.forEach((fns, event) => {
      fns.forEach((fn) => {
        this.#element?.removeEventListener(event, fn);
      });
    });
    this.#listeners.clear();
  }

  listen(event: string, fn: EventListener) {
    const eventListeners = this.#listeners.get(event) ?? [];
    if (!eventListeners.includes(fn)) {
      eventListeners.push(fn);
      this.#listeners.set(event, eventListeners);
      this.#element?.addEventListener(event, fn);
    }
    return this;
  }

  unlisten(event: string, fn: EventListener) {
    const eventListeners = this.#listeners.get(event);
    if (!eventListeners) return this;

    const updatedListeners = eventListeners.filter((f) => f !== fn);

    if (updatedListeners.length > 0) {
      this.#listeners.set(event, updatedListeners);
    } else {
      this.#listeners.delete(event);
    }

    this.#element?.removeEventListener(event, fn);
    return this;
  }

  trigger(event: string) {
    this.#element?.dispatchEvent(new Event(event));
  }

  remove() {
    this.removeListeners();
    this.#element?.remove();
  }

  renderChildren() {
    this.#children.forEach((child) => {
      if (child instanceof UiElement) {
        this.#element?.appendChild(child.render());
        return;
      }
      if (typeof child === 'string') {
        this.#element?.appendChild(document.createTextNode(child));
        return;
      }
      throw new Error(`Invalid child: ${child} of type ${typeof child} at ${this.#tag}`);
    });
  }

  render() {
    if (!this.#element) {
      this.#element = document.createElement(this.#tag) as UiHtmlElement;
      this.#element.__uiElement = this;
    }

    this.setAttributes();
    this.setListeners();

    while (this.#element.firstChild) {
      this.#element.removeChild(this.#element.firstChild);
    }

    this.renderChildren();

    return this.#element;
  }
}

const tags =
  'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'.split(
    ',',
  );

type FactoryArg =
  | string
  | UiElement[]
  | {
      attributes?: Attribute[];
      listeners?: Listener[];
      children?: UiElement[] | string;
    };

const createFactory = (tag: string) => (arg?: FactoryArg) => {
  if (!arg) {
    return new UiElement(tag);
  }

  if (typeof arg === 'string') {
    return new UiElement(tag, [], [], arg);
  }

  if (Array.isArray(arg)) {
    return new UiElement(tag, [], [], arg);
  }

  if (typeof arg === 'object' && arg !== null) {
    return new UiElement(tag, arg.attributes, arg.listeners, arg.children);
  }

  throw new Error(`Invalid argument: ${arg} of type ${typeof arg} for ${tag}`);
};

const factories: Record<string, (arg?: FactoryArg) => UiElement> = Object.fromEntries(
  tags.map((tag) => [tag, createFactory(tag)]),
);

export const {
  a,
  abbr,
  address,
  area,
  article,
  aside,
  audio,
  b,
  base,
  bdi,
  bdo,
  blockquote,
  body,
  br,
  button,
  canvas,
  caption,
  cite,
  code,
  col,
  colgroup,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  header,
  hgroup,
  hr,
  html,
  i,
  iframe,
  img,
  input,
  ins,
  kbd,
  label,
  legend,
  li,
  link,
  main,
  map,
  mark,
  menu,
  meta,
  meter,
  nav,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  param,
  picture,
  pre,
  progress,
  q,
  rp,
  rt,
  ruby,
  s,
  samp,
  script,
  section,
  select,
  slot,
  small,
  source,
  span,
  strong,
  style,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  template,
  textarea,
  tfoot,
  th,
  thead,
  time,
  title,
  tr,
  track,
  u,
  ul,
  video,
  wbr,
} = factories;

export default factories;
