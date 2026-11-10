(function(){
  var KEY="ticket-todo-v1", tasks=[], filter="all", pri="mid";
  var names={hi:"High",mid:"Medium",lo:"Low"}, order={hi:0,mid:1,lo:2};
  try{ tasks=JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ tasks=[]; }
  if(!tasks.length) tasks=[{id:1,t:"Add your first real task",p:"mid",d:false,at:Date.now()}];
  var $=function(s){return document.querySelector(s)};
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(tasks)); }catch(e){} }
  function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
  function render(){
    var done=tasks.filter(function(t){return t.d}).length;
    $("#count").textContent=done+" of "+tasks.length+" punched";
    var h="";
    tasks.slice(0,24).forEach(function(t){h+='<span class="hole'+(t.d?" on":"")+'"></span>'});
    $("#holes").innerHTML=h;
    var shown=tasks.filter(function(t){return filter==="all"||(filter==="done"?t.d:!t.d)})
      .sort(function(a,b){return (a.d-b.d)||(order[a.p]-order[b.p])||(b.at-a.at)});
    var html=shown.map(function(t){
      return '<li class="ticket'+(t.d?" done":"")+'" style="--c:var(--'+t.p+')" data-id="'+t.id+'">'+
        '<div class="stub"><button data-a="tog" aria-label="'+(t.d?"Reopen":"Mark done")+'">'+(t.d?"✓":"")+'</button></div>'+
        '<div class="body"><div class="txt">'+esc(t.t)+'</div><div class="meta">'+names[t.p]+' priority</div>'+
        '<span class="stamp">DONE</span><button class="del" data-a="del" aria-label="Delete task">×</button></div></li>';
    }).join("");
    $("#list").innerHTML=html||'<li class="empty">'+(filter==="done"?"Nothing punched yet. Finish a ticket and it lands here.":"No open tickets. Add one above.")+'</li>';
  }
  function add(){
    var v=$("#in").value.trim(); if(!v) return;
    tasks.push({id:Date.now(),t:v,p:pri,d:false,at:Date.now()});
    $("#in").value=""; save(); render();
  }
  $("#go").onclick=add;
  $("#in").addEventListener("keydown",function(e){ if(e.key==="Enter") add(); });
  $("#pri").onclick=function(e){
    var b=e.target.closest("button"); if(!b) return; pri=b.dataset.p;
    this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});
  };
  $("#tabs").onclick=function(e){
    var b=e.target.closest("button"); if(!b) return; filter=b.dataset.f;
    this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)}); render();
  };
  $("#list").onclick=function(e){
    var b=e.target.closest("button[data-a]"); if(!b) return;
    var id=+b.closest("li").dataset.id;
    if(b.dataset.a==="del") tasks=tasks.filter(function(t){return t.id!==id});
    else tasks.forEach(function(t){ if(t.id===id) t.d=!t.d; });
    save(); render();
  };
  render();
})();
