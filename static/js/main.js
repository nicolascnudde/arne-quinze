(() => {

  const app = {
    
    initialize () {
      this.cacheElements();
      this.registerListeners();
      this.fetchArtAndExhibitions();
      this.fetchAtelierStudio();
      this.fetchPress();
    },

    cacheElements () {
      this.$scrollToTop = document.querySelector('.go-to-top');
      this.$years = document.querySelector('.years-list');
      this.$artExhibitions = document.querySelector('.art-and-exhibitions');
      this.$artExhibitionsHighlights = document.querySelector('.art-exhibitions-highlights-list');
      this.$atelierStudioHome = document.querySelector('.home-atelier-studio-list');
      this.$atelierStudio = document.querySelector('.atelier-studio-list');
      this.$press = document.querySelector('.press-list');
    },

    registerListeners () {
      this.$scrollToTop.addEventListener('click', this.scrollToTop);
    },

    scrollToTop () {
      const top = document.documentElement;
      top.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },

    fetchYears () {
      const YEARS_API = 'data/years.json'
      fetch(YEARS_API)
        .then((response) => response.json())
        .then((json) => {
          this.years = json;
          this.generateHTMLForArtAndExhibitions();
          this.generateHTMLForYears();
        })
        .catch((error) => console.error(error));
    },

    fetchArtAndExhibitions () {
      const ART_API = 'https://www.pgm.gent/data/arnequinze/art.json';
      fetch(ART_API)
        .then((response) => response.json())
        .then((json) => {
        this.art = json;
        this.fetchYears();
        })
        .catch((error) => console.error(error));
    },

    fetchAtelierStudio () {
      const ATELIER_API = 'data/atelier.json';
      fetch(ATELIER_API)
      .then((response) => response.json())
      .then((json) => {
      this.atelier = json;
      this.generateHTMLForAtelierStudio();
      })
      .catch((error) => console.error(error));
    },

    fetchPress () {
      const PRESS_API = 'data/press.json';
      fetch(PRESS_API)
      .then((response) => response.json())
      .then((json) => {
      this.press = json;
      this.generateHTMLForPress();
      })
      .catch((error) => console.error(error));
    },

    generateHTMLForYears () {
      if (this.$years) {
        let tempStr = `
        <li>
          <a href="javascript:;" onclick="document.location.hash='';">Show all</a>
        </li>`

         tempStr += this.years.map((year) => {
          return `
          <li>
          <a href="javascript:;" onclick="document.location.hash='${year}';">${year}</a>
          </li>`
        }).join('');

        this.$years.innerHTML = tempStr;
      };
    },

    generateHTMLForArtAndExhibitionsHighlights () {
      if (this.$artExhibitionsHighlights) {
        this.$artExhibitionsHighlights.innerHTML = this.art.map((ar) => {
          if (ar.highlight === true) {
            return `
            <li class="card">
              <a href="art-and-exhibitions/in-dialogue-with-calatrava/index.html">
                <picture>
                  <img src="static/img/art/${ar.cover}" loading="lazy">
                </picture>
              </a>
              <p class="card__subtitle">${ar.subtitle}</p>
              <h3>${ar.title}</h3>
              <p class="card__description">${ar.description}</p>
              <a href="art-and-exhibitions/in-dialogue-with-calatrava/index.html" class="learn-more">Learn more</a>
            </li>
            `
          };
        }).join('');
      }
    },

    generateHTMLForArtAndExhibitions () {
      if (this.$artExhibitions) {

        const params = new URLSearchParams(window.location.search);
        const urlCategory = params.get('category');
        if (urlCategory !== null) {
          this.art = this.art.filter((a => a.tags.indexOf(urlCategory) > -1))
        };

        const html = this.years.map((year) => {

          const yearFilter = this.art.filter((a) => {
            return a.year.indexOf(year) > -1;
          });

          const items = yearFilter.map((ar) => {

            const artTags = ar.tags.map((tag, index) => {
              return `
              <li class="art-card__tags">
                <p>${tag}</p>
              </li>
              `;
            }).join('');

            const artImages = ar.images.map((img) => { 
              return `
              <li>
                <picture>  
                  <img class="art-card__image" src="static/img/art/${img}" loading="lazy">
                </picture>
              </li>
              `;
            }).join('');

            return `
            <li class="art-card">
              <div class="art-card-text-container">
                <h3 class="art-card__title"><a href="art-and-exhibitions/in-dialogue-with-calatrava/index.html">${ar.title}</a></h3>
                <p class="art-card__subtitle">${ar.subtitle}</p>
                <div class="art-card-tags-location">
                  <ul lass="art-card-tags__list">
                    ${artTags}
                  </ul>
                  <p class="art-card__location">${ar.location}</p>
                </div>
              </div>
              <div class="art-card-img-container">
                <ul class="art-card-image__list">
                  ${artImages}
                </ul>
              </div>
            </li>
            `
          }).join('');

          return `
          <div class="art-exhibitions-${year}">
            <h2 id=${year}>${year}</h2>
            <ul class="art-exhibitions-list">
              ${items}
            </ul>
          </div>
          `
        }).join('');
        
        this.$artExhibitions.innerHTML = html;

      }
      this.generateHTMLForArtAndExhibitionsHighlights(this.art);
    },

    generateHTMLForHomeAtelierStudio () {
      if (this.$atelierStudioHome) {
        // Using 'splice(0, 3)' to only show the first three objects from the array
        this.$atelierStudioHome.innerHTML = this.atelier.splice(0, 3).map((at) => {
          return `
          <li class="card">
            <a href="atelier-studio/visiting-mons-again/index.html">
              <picture>
                <img src="static/img/atelier/${at.image}" loading="lazy">
              </picture>
            </a>
            <p class="card__subtitle">${at.subtitle}</p>
            <h3>${at.title}</h3>
            <p class="card__description">${at.description}</p>
            <a href="atelier-studio/visiting-mons-again/index.html" class="learn-more">Learn more</a>
          </li>
          `
        }).join('');
      }
    },

    generateHTMLForAtelierStudio () {
      if (this.$atelierStudio) {
        // Not using splice to show all of the objects from the array
        this.$atelierStudio.innerHTML = this.atelier.map((at) => {
          return `
          <li class="card">
            <a href="atelier-studio/visiting-mons-again/index.html">
              <picture>
                <img src="static/img/atelier/${at.image}" loading="lazy">
              </picture>
            </a>
            <p class="card__subtitle">${at.subtitle}</p>
            <h3>${at.title}</h3>
            <p class="card__description">${at.description}</p>
            <a href="atelier-studio/visiting-mons-again/index.html" class="learn-more">Learn more</a>
          </li>
          `
        }).join('');
      };
      this.generateHTMLForHomeAtelierStudio(this.$atelierStudio);
    },

    generateHTMLForPress () {
      if (this.$press) {
        this.$press.innerHTML = this.press.map((pr) => {
          return `
          <li class="card">
            <a href="press/my-secret-garden-valencia/index.html">
              <picture>
                <img src="static/img/press/${pr.image}" loading="lazy">
              </picture>
            </a>
            <p class="card__subtitle">${pr.subtitle}</p>
            <h3>${pr.title}</h3>
            <p class="card__description">${pr.description}</p>
            <a href="press/my-secret-garden-valencia/index.html" class="learn-more">Open press release</a>
          </li>
          `
        }).join('');
      };
    }

  };
  
  app.initialize();

})();