import { PageTemplate } from "../lib/pageTemplate.js";

class pgHome extends PageTemplate {
    constructor() {
        super();
        this.isHomePage = true;
    }

    private heroHTML() {
        return `
            <section class="main-hero">
                <h1 class="main-title">Welcome!</h1>
            </section>`;
    }

    private servicesHTML() {
        return `
            <section class="section">
                <h2 class="section-title">Services</h2>
                <div class="services">
                    <article class="service">
                        <img class="service-thumbnail" src="/" alt="Service thumbnail">
                        <h3 class="service-title">Service title</h3>
                        <p class="service-description">Some service description for user to read about.</p>
                        <p class="service-price">Price: 5.49 Eur</p>
                    </article>
                    <article class="service skeleton">
                        <img class="service-thumbnail" src="/" alt="">
                        <h3 class="service-title skeleton-w-50"></h3>
                        <p class="service-description"></p>
                        <p class="service-price skeleton-w-20"></p>
                    </article>
                    <article class="service skeleton">
                        <img class="service-thumbnail" src="/" alt="">
                        <h3 class="service-title skeleton-w-50"></h3>
                        <p class="service-description"></p>
                        <p class="service-price skeleton-w-20"></p>
                    </article>
                    <article class="service skeleton">
                        <img class="service-thumbnail" src="/" alt="">
                        <h3 class="service-title skeleton-w-50"></h3>
                        <p class="service-description"></p>
                        <p class="service-price skeleton-w-20"></p>
                    </article>
                    <article class="service skeleton">
                        <img class="service-thumbnail" src="/" alt="">
                        <h3 class="service-title skeleton-w-50"></h3>
                        <p class="service-description"></p>
                        <p class="service-price skeleton-w-20"></p>
                    </article>
                    <article class="service skeleton">
                        <img class="service-thumbnail" src="/" alt="">
                        <h3 class="service-title skeleton-w-50"></h3>
                        <p class="service-description"></p>
                        <p class="service-price skeleton-w-20"></p>
                    </article>
                </div>
                <a class="btn" href="/services">All services</a>
            </section>`;
    }

    main(): string {
        return this.heroHTML() + this.servicesHTML();
    }
}

export { pgHome };