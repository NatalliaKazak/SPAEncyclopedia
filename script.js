  var SPAStateH={};
  var LoadInfoH = null;
  var pageMain= document.getElementById('IPage');
  var dataMenuPage = null;

  function LoadData(k, type, func)  {
    $.ajax(k,
      { type:'GET', dataType:'html', success:func, error:ErrorHandler }
        );
    }
  function ErrorHandler(jqXHR,StatusStr,ErrorStr) {
    console.log(StatusStr+' '+ErrorStr);
  }

  if (LoadInfoH=== null)   {
    LoadData('https://gist.githubusercontent.com/NatalliaKazak/52bc7ef250e0f14233fde78e5f6d3026/raw/da3ff2fe521fbe95210da8e8386323f51f143b20/gistfile1.txt',  "json", LoadInfo) ;
  }

  function LoadInfo(data){
    result=data;
    LoadInfoH = JSON.parse(result);
    window.onhashchange=SwitchToStateFromURLHash;
    SwitchToStateFromURLHash();
  }
   
  function SwitchToStateFromURLHash(data) {    
    var URLHash=window.location.hash;    
    var StateStr=URLHash.substr(1);
    if ( StateStr!="" )   {
      var PartsA=StateStr.split("_")
      SPAStateH={ pagename: PartsA[0] }; 
      if ( SPAStateH.pagename=='Article' ) 
      SPAStateH.photoid=PartsA[1]; 
    } else
    SPAStateH={pagename:'Main'}; 
    switch ( SPAStateH.pagename ) {
      case 'Main':
        LoadData(LoadInfoH[1].html, 'html',DataLoadedMain );
        break;
      case 'Menu':
        LoadData(LoadInfoH[2].json, 'json',DataLoadedMenu )
        break;
      case 'Article':
        LoadData(LoadInfoH[2].json, 'json',DataLoadedMenu )
        LoadData(LoadInfoH[SPAStateH.photoid].artURL, 'html',DataLoadedArticleInfo)
        break;
    }
  }

  function DataLoadedMain(data)   {
    pageMain.innerHTML="";
    var divEl = document.createElement('div');
    divEl.innerHTML +="<h3>O нас!</h3>";
    divEl.innerHTML+= data;
    divEl.innerHTML+='<input type=button id="MenuBTN" value="Статьи"> ';
    pageMain.appendChild(divEl);
    BTNListener('MenuBTN', SwitchToMenuPage)
  }

  function DataLoadedMenu(data)   {
    pageMain.innerHTML="";
    var divEl = document.createElement('div');
    divEl.innerHTML +='<input type=button id="MainBTN" value="На главную страницу"> ';
    divEl.innerHTML +="<h3>Оглавление</h3>";
    dataMenuPage = data
    var array = JSON.parse(dataMenuPage);
    var Alphabet = als();
    for (var a=0; a< Alphabet.length; a++){
      for (var i=0; i< array.length; i++){
        if(Alphabet[a] === array[i].toUpperCase().charAt(0)){
          divEl.innerHTML+="<ul>"+Alphabet[a];
          divEl.innerHTML+="<li id="+array[i]+">"+array[i]+"</li>";
        }
        divEl.innerHTML +="</ul>";
      }
    }
    pageMain.appendChild(divEl);
    BTNListener("MainBTN",SwitchToMainPage);
    BTNListenerArt("li");
    divEl.style.cssFloat = "left";
    divEl.style.width = "20%";
  } 

  function DataLoadedArticleInfo(data)   {
    var divRight = document.createElement("div");
    divRight.innerHTML +='<input type=button id="Menu2BTN" value="В раздел статей"> ';
    DataLoadedMenu(dataMenuPage);
    divRight.setAttribute('class',"divRight")
    divRight.innerHTML += "<img src='"+LoadInfoH[SPAStateH.photoid].image+"'>";
    divRight.innerHTML += data;
    pageMain.appendChild(divRight)
    divRight.style.width = "75%"
    divRight.style.cssFloat = "right"
    BTNListener("Menu2BTN",SwitchToMenuPage);
  }
    
  function als() {
    var array=[]
    for (var i=1040; i<=1071; i++){
      var s=String.fromCharCode(i)
      array.push(s)
    }
    array.push("Ё")
    array.sort(uniSort);
    return array;
  }

  function uniSort(a, b) {
    var aCode = a.toLowerCase().replace('ё','е'+String.fromCharCode(1110));
    var bCode = b.toLowerCase().replace('ё','е'+String.fromCharCode(1110));
    if (aCode > bCode)
      return 1;
    if (aCode < bCode)
      return -1;
    else
      return 0;
  }
  
  function SwitchToState(NewStateH)   {
    var StateStr=NewStateH.pagename;
    if ( NewStateH.pagename=='Article' )
      StateStr+="_"+NewStateH.photoid;
    location.hash=StateStr;
  }

  function SwitchToMainPage()   {
    SwitchToState( { pagename:'Main' } );
  }

  function SwitchToArticlePage(PhotoId)  {
    SwitchToState( { pagename:'Article', photoid:PhotoId} ); 
  }
   function SwitchToMenuPage()  {
    SwitchToState( { pagename:'Menu' } );
  }
  function BTNListener(id, fun)  {
    var btn = document.getElementById(id);
    btn.addEventListener("click", fun, false);
  }

  function BTNListenerArt(id)  {
    var arrayLi = document.getElementsByTagName(id)
    for (i = 0; i <arrayLi.length; i++) {
      arrayLi[i].addEventListener('click', listener,false)
      arrayLi[i].style.cursor = "pointer";
    }
  }
  function listener (e){
    e = e || window.event;
    var el = e.target || e.srcElement;
    SwitchToArticlePage(el.id);
  }
