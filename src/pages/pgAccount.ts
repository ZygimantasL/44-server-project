import { PageTemplate } from "../lib/pageTemplate.js";

export class pgAccount extends PageTemplate {
    constructor() {
        super();
        this.pageTitle = 'Account';
    }

    private heroHTML() {
        return `
            <section class="inner-hero">
                <h1 class="main-title">Account!</h1>
            </section>`;
    }

    private servicesHTML() {
        return `
            <section class="section">
                <p>Welcome to user dashboard/account page!</p>
            </section>`;
    }

    main(): string {
        return this.heroHTML() + this.servicesHTML();
    }
}

export default pgAccount;