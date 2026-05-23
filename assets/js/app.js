/* CityLink Services - vanilla JS SPA
   Responsibilities:
   - data store (dummy providers)
   - render UI (cards, chips)
   - search & category filters
   - favorites in localStorage
   - simple SPA navigation (home / add)
*/
(function(){
  const STORAGE_KEY = 'citylink_favs_v1';

  // --- Dummy data ---
  const providers = [
    {id:1,name:'QuickFix Mobiles',category:'Repairs',description:'Phone screen & battery replacement, fast same-day service.',location:'Near Engineering Block, UG',city:'Accra',phone:'+233244111222',image:'https://images.unsplash.com/photo-1510552776732-01aa75b63a6d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:2,name:'Campus Tailors',category:'Tailoring',description:'Affordable tailoring for students — uniforms, alterations.',location:'Opposite Science Faculty, Legon',city:'Accra',phone:'+233244333444',image:'https://images.unsplash.com/photo-1520975913879-0f7b0e8eae6b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:3,name:'BrightPrints',category:'Printing',description:'High-quality printing and photocopy services with binding.',location:'Accra Mall Annex',phone:'+233244555666',image:'https://images.unsplash.com/photo-1526312426976-6fcf8b8d8a00?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:4,name:'Ngozi Tutor Hub',category:'Tutoring',description:'Math and CS tutors for secondary & university students.',location:'Near Central Library, UG',phone:'+233244777888',image:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:5,name:'Mama K’s Kitchen',category:'Food',description:'Home-style Ghanaian meals and quick bites.',location:'Opposite Accra Sports Stadium',phone:'+233244999000',image:'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:6,name:'Ink & Paper',category:'Printing',description:'Student-friendly prices for flyers and reports.',location:'Spintex Road',city:'Accra',phone:'+233244101010',image:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:7,name:'TailorX',category:'Tailoring',description:'Modern designs and quick alterations for events.',location:'Osu Market',city:'Accra',phone:'+233244202020',image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:8,name:'FixIt Tech',category:'Repairs',description:'Laptop and phone diagnostics, virus removal.',location:'Tema Community Mall',city:'Takoradi',phone:'+233244303030',image:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:9,name:'StudyBuddy',category:'Tutoring',description:'Group sessions and exam prep for undergraduates.',location:'North Ridge',city:'Cape Coast',phone:'+233244404040',image:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:10,name:'Campus Courier',category:'Miscellaneous',description:'Delivery and errand services for students.',location:'Legon Campus',city:'Sunyani',phone:'+233244505050',image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:11,name:'PrintLab',category:'Printing',description:'Large format printing and poster services.',location:'Osu',city:'Kumasi',phone:'+233244606060',image:'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:12,name:'Rosa’s Eats',category:'Food',description:'Quick wraps, local soups and fresh juices.',location:'Opposite University Library',city:'Cape Coast',phone:'+233244707070',image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:13,name:'GadgetCare',category:'Repairs',description:'Water damage specialists and component repair.',location:'Makola Market',city:'Accra',phone:'+233244808080',image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:14,name:'Style & Stitch',category:'Tailoring',description:'Custom clothing and urgent mending services.',location:'Kaneshie',city:'Takoradi',phone:'+233244909090',image:'https://images.unsplash.com/photo-1520975913879-0f7b0e8eae6b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:15,name:'EduPrints',category:'Printing',description:'Affordable printing near campus with student discounts.',location:'Near Engineering Block, UG',city:'Accra',phone:'+233245111222',image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='}
  ];

  const CITIES = ['All','Accra','Cape Coast','Takoradi','Kumasi','Sunyani'];

  const CATEGORIES = ['All','Repairs','Tutoring','Tailoring','Printing','Food','Miscellaneous'];

  // --- State ---
  let state = {query:'',category:'All',city:'All',favorites:loadFavorites(),data:providers.slice()};

  // --- DOM ---
  const el = {
    chips: document.getElementById('chips'),
    cards: document.getElementById('cards'),
    search: document.getElementById('searchInput'),
    citySelect: document.getElementById('citySelect'),
    clearSearch: document.getElementById('clearSearch'),
    noResults: document.getElementById('noResults'),
    viewHome: document.getElementById('view-home'),
    viewAdd: document.getElementById('view-add'),
    addForm: document.getElementById('addForm'),
    addSuccess: document.getElementById('addSuccess'),
    cancelAdd: document.getElementById('cancelAdd'),
    backHome: document.getElementById('backHome'),
    navToggle: document.getElementById('navToggle'),
    mobileNav: document.getElementById('mobileNav')
  };

  // --- init ---
  function init(){
    renderChips();
    bindEvents();
    render();
    syncRoute();
    window.addEventListener('popstate',syncRoute);
  }

  // --- favorites ---
  function loadFavorites(){
    try{const s=localStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):[];}catch(e){return []}
  }
  function saveFavorites(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.favorites));}
  function toggleFav(id){
    const idx = state.favorites.indexOf(id);
    if(idx>=0) state.favorites.splice(idx,1); else state.favorites.push(id);
    saveFavorites(); render();
  }

  // --- rendering ---
  function renderChips(){
    el.chips.innerHTML='';
    CATEGORIES.forEach(cat=>{
      const b=document.createElement('button');b.className='chip'+(state.category===cat? ' active':'' );
      b.textContent=cat; b.setAttribute('role','tab'); b.onclick=()=>{state.category=cat;render();};
      el.chips.appendChild(b);
    });
  }

  function matches(item){
    const q = state.query.trim().toLowerCase();
    const catMatch = state.category==='All' || item.category.toLowerCase()===state.category.toLowerCase();
    if(!catMatch) return false;
    if(!q) return true;
    return [item.name,item.description,item.location,item.category].join(' ').toLowerCase().includes(q);
  }

  function render(){
    renderChips();
    const list = state.data.filter(matches);
    el.cards.innerHTML='';
    if(list.length===0){el.noResults.hidden=false; return;} else el.noResults.hidden=true;
    list.forEach(item=>{
      const card=document.createElement('article');card.className='card';
      card.innerHTML = `
        <div class="thumb" style="background-image:url('${item.image}')" role="img" aria-label="${escapeHtml(item.name)}"></div>
        <div class="card-body">
          <h3>${escapeHtml(item.name)}</h3>
          <div class="meta">${escapeHtml(item.category)} • ${escapeHtml(item.location)} • ${escapeHtml(item.city)}</div>
          <div class="meta">${escapeHtml(item.description)}</div>
          <div class="actions">
            <a class="btn" href="tel:${item.phone}" aria-label="Call ${escapeHtml(item.name)}">📞 Call</a>
            <a class="btn" target="_blank" rel="noopener" href="https://wa.me/${cleanPhone(item.phone)}" aria-label="WhatsApp ${escapeHtml(item.name)}">💬 WhatsApp</a>
            <button class="icon-btn fav" aria-pressed="false" data-id="${item.id}">♥</button>
          </div>
        </div>`;
      const favBtn = card.querySelector('.fav');
      if(state.favorites.includes(item.id)){favBtn.classList.add('active'); favBtn.setAttribute('aria-pressed','true')} 
      favBtn.addEventListener('click',()=>toggleFav(item.id));
      el.cards.appendChild(card);
    });
  }

  // --- helpers ---
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]});}
  function cleanPhone(p){return String(p).replace(/[^0-9+]/g,'').replace(/^\+/, '');}

  // --- events ---
  function bindEvents(){
    el.search.addEventListener('input',e=>{state.query=e.target.value;render();});
    el.citySelect.addEventListener('change',e=>{state.city=e.target.value;render();});
    el.clearSearch.addEventListener('click',()=>{el.search.value='';state.query='';render();el.search.focus();});
    el.addForm.addEventListener('submit',onAddSubmit);
    el.cancelAdd.addEventListener('click',()=>navigate('/'));
    document.getElementById('backHome').addEventListener('click',()=>navigate('/'));
    el.navToggle.addEventListener('click',toggleNav);
    document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{toggleNav(false);}));
    // simple card keyboard accessibility
    el.cards.addEventListener('keydown',e=>{if(e.key==='Enter' && e.target.dataset && e.target.dataset.id) toggleFav(Number(e.target.dataset.id));});
  }

  function onAddSubmit(e){
    e.preventDefault();
    const d = new FormData(el.addForm);
    const newItem = {
      id: Date.now(),
      name: d.get('name'),
      category: d.get('category'),
      city: d.get('city')||'Other',
      description: d.get('description'),
      location: d.get('location'),
      phone: d.get('phone'),
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='
    };
    state.data.unshift(newItem);
    el.addForm.reset();
    el.addSuccess.hidden=false; el.addForm.hidden=true;
    render();
  }

  // --- nav / routing ---
  function navigate(path){
    history.pushState({},'',path);
    syncRoute();
  }
  function syncRoute(){
    const p = location.pathname || location.hash.replace('#','') || '/';
    if(p.includes('add')){showAdd()} else showHome();
  }
  function showHome(){el.viewHome.hidden=false; el.viewAdd.hidden=true; document.title='CityLink Services — Find trusted local services';}
  function showAdd(){el.viewHome.hidden=true; el.viewAdd.hidden=false; document.title='Add Service — CityLink Services';}

  // --- mobile nav ---
  function toggleNav(force){
    const open = typeof force==='boolean'? force : el.mobileNav.getAttribute('aria-hidden')==='true';
    el.mobileNav.style.display = open? 'block':'none';
    el.mobileNav.setAttribute('aria-hidden', String(!open));
  }

  // --- bootstrap ---
  init();

})();
