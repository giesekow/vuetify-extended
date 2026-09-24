import type { FieldParams } from '../lib/esm/ui/field';
const defaults: FieldParams = { type: 'select' };
const disabled: FieldParams = { type: 'select', menuTransition: false };
const named: FieldParams = { type: 'autocomplete', menuTransition: 'fade-transition' };
// @ts-expect-error Only false disables the menu transition; true is not a transition name.
const invalid: FieldParams = { menuTransition: true };
void [defaults, disabled, named, invalid];
