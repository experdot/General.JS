import { IRule } from "./Rule";
import { IState } from "../State/State";

class RuleSet<T> {
    rules: IRule<T>[];

    constructor() {
        this.rules = [];
    }

    add(rule: IRule<T>) {
        this.rules.push(rule);
    }

    generate(parent: IState<T>, generation: number = 0) {
        const rule = this.rules[generation] || this.rules[0];
        return rule ? rule.generate(parent) : [parent.next()];
    }
}
export {
    RuleSet
};