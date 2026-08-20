(function(){
  var choices = document.querySelectorAll('.choice');
  var panelWrap = document.getElementById('panelWrap');
  var panel = document.getElementById('panel');
  var fieldGroups = document.querySelectorAll('[data-fields]');
  var confirmMsg = document.getElementById('confirmMsg');

  choices.forEach(function(btn){
    btn.addEventListener('click', function(){
      var key = btn.getAttribute('data-key');
      choices.forEach(function(b){ b.classList.toggle('active', b === btn); });
      fieldGroups.forEach(function(g){ g.hidden = g.getAttribute('data-fields') !== key; });
      panel.setAttribute('data-active', key);
      panelWrap.classList.add('open');
      confirmMsg.classList.remove('show');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        panel.scrollIntoView({block:'nearest'});
      } else {
        setTimeout(function(){ panel.scrollIntoView({behavior:'smooth', block:'nearest'}); }, 120);
      }
    });
  });

  document.querySelectorAll('[data-toggle-group]').forEach(function(group){
    group.querySelectorAll('.toggle-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        group.querySelectorAll('.toggle-btn').forEach(function(b){ b.classList.remove('selected'); });
        btn.classList.add('selected');
      });
    });
  });

  function toggleValue(groupName){
    var selected = document.querySelector('[data-toggle-group="' + groupName + '"] .toggle-btn.selected');
    return selected ? selected.textContent.trim() : '';
  }

  var submitBtn = panel.querySelector('.submit-btn');
  var errorMsg = document.getElementById('errorMsg');

  panel.addEventListener('submit', function(e){
    e.preventDefault();
    var active = panel.getAttribute('data-active');
    if (!active) return;

    var data = {
      access_key: '1c53e0fe-595d-43fa-9beb-f96fec5c3ba6',
      subject: 'Nieuwe aanvraag via bobdemakelaar.nl — ' + active,
      from_name: 'Bob de Makelaar website',
      dienst: active,
      naam: document.getElementById('c-naam').value,
      email: document.getElementById('c-email').value,
      telefoon: document.getElementById('c-tel').value
    };

    if (active === 'aankoop') {
      data.zoekgebied = document.getElementById('a-zoekgebied').value;
      data.type_woning = document.getElementById('a-type').value;
      data.hypotheekgesprek = toggleValue('a-hypotheek');
    } else if (active === 'verkoop') {
      data.locatie = document.getElementById('v-locatie').value;
      data.type_woning = document.getElementById('v-type').value;
      data.straat = document.getElementById('v-straat').value;
    } else if (active === 'taxatie') {
      data.doel = toggleValue('t-doel');
      data.type_woning = document.getElementById('t-type').value;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen...';
    confirmMsg.classList.remove('show');
    errorMsg.classList.remove('show');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function(res){ return res.json(); })
      .then(function(json){
        submitBtn.disabled = false;
        submitBtn.textContent = 'Versturen';
        if (json.success) {
          confirmMsg.classList.add('show');
          panel.reset();
          document.querySelectorAll('.toggle-btn.selected').forEach(function(b){ b.classList.remove('selected'); });
        } else {
          errorMsg.classList.add('show');
        }
      })
      .catch(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = 'Versturen';
        errorMsg.classList.add('show');
      });
  });
})();
