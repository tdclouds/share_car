import{u as F}from"./Sh0J5Mql.js";import{d as H,m as L,r,p as T,o as Y,a as i,b as s,c as u,g as a,e as c,w as p,F as g,I as w,J as z,q as f,T as x,y as o,f as E,t as M,U as N}from"./assets/index-aeLSw1Ag.js";import{d as S}from"./CY-rI5Sl.js";const V={class:"w-[1200px] max-w-full m-auto"},R={class:"flex items-start justify-between mb-4"},I={class:"flex flex-wrap gap-5 mb-5"},J={class:"text-center"},O={class:"flex items-center justify-between"},W=a("span",null,"使用时间",-1),$={class:"flex items-center justify-between"},A=a("span",null,"实际采集请求次数，失败请求同样计算在内",-1),G={class:"flex items-center justify-between"},K=a("span",null,"对话次数",-1),P={class:"flex items-center justify-between"},Q=a("span",null,"代码提示次数",-1),te=H({__name:"index",setup(X){const t=L({page:1,limit:15}),d=r(!1),v=r([]),_=r([]),b=r(0);function y(){d.value=!0}const{run:h}=F(async()=>S(z(t)).then(l=>{v.value=l.list,b.value=l.total,_.value=l.filter,k(),d.value=!1}),{debounceWait:1e3,manual:!0});function k(){_.value.forEach(l=>{l.options&&(C.value[l.name]=l.options.filter(n=>n.value!==0))})}T(t,()=>{d.value===!1&&(t.page=1),h()});const C=r({});return Y(h),(l,n)=>{const U=i("a-form-item"),j=i("a-form"),q=i("a-divider"),D=i("a-tooltip"),B=i("a-pagination");return s(),u("div",V,[a("div",R,[c(j,{class:"filter sm:hidden",layout:"inline"},{default:p(()=>[(s(!0),u(g,null,w(_.value,e=>(s(),f(U,{key:e.name,label:e.label},{default:p(()=>[e.type==="datetime"?(s(),f(x("a-date-picker"),{key:0,value:t[e.name],"onUpdate:value":m=>t[e.name]=m,placeholder:e.label,"show-time":{format:"HH:mm"},"allow-clear":"",class:"w-[180px!important] mr-2 mb-2",valueFormat:"YYYY-MM-DD HH:mm:ss"},null,40,["value","onUpdate:value","placeholder"])):(s(),f(x("a-"+e.type),{key:1,value:t[e.name],"onUpdate:value":m=>t[e.name]=m,options:e.options,placeholder:e.label,"allow-clear":"",class:"w-[180px!important] mr-2 mb-2"},null,40,["value","onUpdate:value","options","placeholder"]))]),_:2},1032,["label"]))),128))]),_:1})]),a("div",I,[(s(!0),u(g,null,w(v.value,e=>(s(),u("div",{class:"bg-white dark:bg-gray-800 p-4 rounded sm:w-full w-[386px]",key:e.session_no},[a("div",J,o(e.start_time)+"-"+o(e.end_time),1),c(q,{class:"my-2"}),a("div",O,[W,a("span",null,o(e.total_time_label||"0"),1)]),a("div",$,[a("span",null,[E("请求次数 "),c(D,{placement:"top"},{title:p(()=>[A]),default:p(()=>[c(M(N))]),_:1})]),a("span",null,o(e.total_req_label||"0"),1)]),a("div",G,[K,a("span",null,o(e.total_chat_req_label||"0"),1)]),a("div",P,[Q,a("span",null,o(e.total_prompt_req_label||"0"),1)])]))),128))]),c(B,{class:"flex justify-center",current:t.page,"onUpdate:current":n[0]||(n[0]=e=>t.page=e),"page-size":t.limit,"onUpdate:pageSize":n[1]||(n[1]=e=>t.limit=e),total:b.value,"hide-on-single-page":!0,onChange:y,"show-total":e=>`共 ${e} 条`},null,8,["current","page-size","total","show-total"])])}}});export{te as default};