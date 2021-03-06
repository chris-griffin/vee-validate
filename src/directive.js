import ListenerGenerator from './listeners';
import { getScope } from './utils/helpers';

const listenersInstances = [];

export default (options) => ({
    bind(el, binding, vnode) {
        const listener = new ListenerGenerator(el, binding, vnode, options);
        listener.attach();
        listenersInstances.push({ vm: vnode.context, el, instance: listener });
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        context.$validator.validate(expression || el.name, value, getScope(el));
    },
    unbind(el, binding, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        holder.instance.detach();
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});
