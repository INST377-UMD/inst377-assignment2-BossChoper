async function loadDogs() {
    const res = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const data = await res.json();
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = data.message.map(img => `<div><img src="${img}" width="300"></div>`).join('');
    new SimpleSlider(carousel);
  }
  async function loadBreeds() {
    const res = await fetch('https://dogapi.dog/api/v2/breeds');
    const data = await res.json();
    const btnContainer = document.getElementById('breed-buttons');
    data.data.forEach(breed => {
      const btn = document.createElement('button');
      btn.innerText = breed.attributes.name;
      btn.className = 'custom-btn';
      btn.setAttribute('data-id', breed.id);
      btn.onclick = () => showBreedInfo(breed.attributes);
      btnContainer.appendChild(btn);
    });
  }
  function showBreedInfo(attr) {
    const container = document.getElementById('breed-info');
    container.innerHTML = `
      <h3>${attr.name}</h3>
      <p>${attr.description}</p>
      <p>Lifespan: ${attr.min_life}–${attr.max_life} years</p>`;
  }
  loadDogs();
  loadBreeds();
  if (annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
      'change background to *color': (color) => document.body.style.backgroundColor = color,
      'go to *page': (page) => {
        if (page.includes('stock')) window.location.href = 'stocks.html';
        else if (page.includes('dog')) window.location.href = 'dogs.html';
      }
    };
    annyang.addCommands(commands);
  }