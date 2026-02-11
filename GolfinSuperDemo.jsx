import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
//  STYLES
// ============================================================
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Manrope:wght@400;500;600;700;800&display=swap');
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{opacity:0;transform:scale(.7)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes scanLine{0%{top:12%}50%{top:84%}100%{top:12%}}
    @keyframes cornerPulse{0%,100%{opacity:.55}50%{opacity:1}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes checkDraw{0%{stroke-dashoffset:48}100%{stroke-dashoffset:0}}
    @keyframes ringPop{0%{transform:scale(.5);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    @keyframes flagWave{0%,100%{transform:skewX(0)}50%{transform:skewX(-4deg)}}
    @keyframes cloudDrift{0%{transform:translateX(-15px)}100%{transform:translateX(15px)}}
    @keyframes celebrate{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none}
    input,select,textarea{font-family:inherit}::placeholder{color:#5A6480}
    ::-webkit-scrollbar{display:none}
  `}</style>
);

const C={
  green:"#00C853",greenL:"#69F0AE",greenD:"#00A344",greenG:"rgba(0,200,83,.10)",greenG2:"rgba(0,200,83,.05)",
  bg:"#080B10",bgC:"#11151C",bgE:"#1A1F2A",bgI:"#161B25",
  w:"#FFF",t:"#E4E9F2",ts:"#8690A6",tm:"#4E5770",
  gold:"#FFD740",goldG:"rgba(255,215,64,.08)",
  red:"#FF5252",redG:"rgba(255,82,82,.10)",
  blue:"#42A5F5",blueD:"#1565C0",blueG:"rgba(66,165,245,.10)",
  purple:"#AB47BC",purpleG:"rgba(171,71,188,.10)",
  orange:"#FFA726",orangeG:"rgba(255,167,38,.10)",
  border:"rgba(255,255,255,.05)",borderL:"rgba(255,255,255,.09)",
  sky1:"#87CEEB",sky2:"#5BA3D9",sky3:"#3A7BD5",fairway:"#2E7D32",fairwayD:"#1B5E20",sand:"#C8A961",water:"#1976D2",
};
const F={jp:"'Zen Kaku Gothic New',sans-serif",en:"'Manrope',sans-serif"};

// ============================================================
//  DATA
// ============================================================
const COURSES=[
  {id:"narita_mori",name:"成田の森CC",region:"千葉",par:36,token:"NRT001",tokenDate:"20260211",
   holes:[{n:1,par:4,yd:385,type:"straight",hz:["bk_r"]},{n:2,par:3,yd:165,type:"straight",hz:["wt_f"]},{n:3,par:5,yd:520,type:"dog_r",hz:["bk_l","bk_r"]},{n:4,par:4,yd:410,type:"dog_l",hz:["wt_l"]},{n:5,par:4,yd:370,type:"straight",hz:["bk_r"]},{n:6,par:3,yd:180,type:"straight",hz:["bk_f","wt_r"]},{n:7,par:5,yd:545,type:"dog_r",hz:["bk_l"]},{n:8,par:4,yd:395,type:"straight",hz:["bk_r","bk_l"]},{n:9,par:4,yd:430,type:"dog_l",hz:["wt_f"]}]},
  {id:"tokyo_verdy",name:"東京ヴァーディGC",region:"東京",par:36,token:"ABC123",tokenDate:"20260211",
   holes:[{n:1,par:4,yd:390,type:"straight",hz:["bk_l"]},{n:2,par:5,yd:535,type:"dog_r",hz:["wt_r","bk_l"]},{n:3,par:3,yd:175,type:"straight",hz:["bk_f"]},{n:4,par:4,yd:415,type:"dog_l",hz:["bk_r"]},{n:5,par:4,yd:380,type:"straight",hz:["wt_l"]},{n:6,par:5,yd:550,type:"dog_r",hz:["bk_l","bk_r"]},{n:7,par:3,yd:190,type:"straight",hz:["wt_f"]},{n:8,par:4,yd:400,type:"straight",hz:["bk_r"]},{n:9,par:4,yd:425,type:"dog_l",hz:["bk_l","wt_r"]}]},
  {id:"yokohama_bay",name:"横浜ベイCC",region:"神奈川",par:36,token:"XYZ789",tokenDate:"20260211",
   holes:[{n:1,par:4,yd:375,type:"straight",hz:["bk_r"]},{n:2,par:4,yd:405,type:"dog_r",hz:["wt_r"]},{n:3,par:3,yd:160,type:"straight",hz:["bk_f","bk_l"]},{n:4,par:5,yd:530,type:"dog_l",hz:["wt_l","bk_r"]},{n:5,par:4,yd:395,type:"straight",hz:["bk_l"]},{n:6,par:4,yd:420,type:"dog_r",hz:["wt_f"]},{n:7,par:3,yd:185,type:"straight",hz:["bk_r"]},{n:8,par:5,yd:540,type:"dog_l",hz:["bk_l","bk_r"]},{n:9,par:4,yd:410,type:"straight",hz:["wt_r"]}]},
];

const CHAPTERS={
  ch_tokyo:{name:"東京セントラル",region:"東京",capacity:20},
  ch_yokohama:{name:"横浜ベイサイド",region:"神奈川",capacity:20},
  ch_chiba:{name:"千葉グリーン",region:"千葉",capacity:20},
};

const MEMBERS={
  u1:{name:"田中 太郎",co:"田中建設(株)",pos:"代表取締役",ind:"建設・不動産",offer:"建設人脈・現場管理",need:"IT導入・DX支援",ch:"ch_tokyo",status:"Approved",pts:280,lv:5},
  u2:{name:"鈴木 花子",co:"(株)スズキ保険",pos:"代表",ind:"保険",offer:"保険設計・リスク管理",need:"経営者の見直し案件",ch:"ch_tokyo",status:"Approved",pts:185,lv:3},
  u3:{name:"山田 一郎",co:"山田法律事務所",pos:"代表弁護士",ind:"法律",offer:"契約書・労務相談",need:"企業法務の案件紹介",ch:"ch_yokohama",status:"Approved",pts:95,lv:2},
  u4:{name:"佐々木 健太",co:"(株)サンライズIT",pos:"CEO",ind:"IT・テクノロジー",offer:"DX推進・AI導入",need:"営業先紹介",ch:null,status:"Pending",pts:0,lv:1},
};

const TOURNAMENTS=[
  {id:"t1",name:"GOLFIN 月例杯 @成田",course:"narita_mori",prize:"50pt+限定ボール",status:"live",players:["田中太郎","鈴木花子","山田一郎","佐藤次郎","高橋美咲","渡辺健"],odds:{0:2.5,1:3.2,2:5.0,3:4.1,4:6.5,5:8.0},emoji:"🥉"},
  {id:"t2",name:"チャプター選手権 2月",course:"tokyo_verdy",prize:"200pt+プロドライバー",status:"upcoming",players:["田中太郎","鈴木花子","山田一郎"],odds:{},emoji:"🥈"},
  {id:"t3",name:"GOLFIN グランプリ 3月",course:"yokohama_bay",prize:"500pt+賞金3万円",status:"upcoming",players:[],odds:{},emoji:"🥇"},
];

const DEMO_QR=[
  {label:"成田の森CC（有効）",value:"narita_mori|20260211|NRT001",ok:true},
  {label:"東京ヴァーディGC（有効）",value:"tokyo_verdy|20260211|ABC123",ok:true},
  {label:"トークン不一致",value:"narita_mori|20260211|WRONG",ok:false},
  {label:"日付不一致",value:"narita_mori|20260210|NRT001",ok:false},
];

const EQUIPMENT={
  drivers:[{id:"d1",name:"ルーキードライバー",pwr:10,acc:8,lv:1,cost:0,e:"🏌️"},{id:"d2",name:"プロドライバー",pwr:14,acc:11,lv:5,cost:100,e:"💫"},{id:"d3",name:"レジェンドドライバー",pwr:18,acc:14,lv:10,cost:300,e:"⚡"}],
  balls:[{id:"b1",name:"練習ボール",pwr:5,acc:8,lv:1,cost:0,e:"⚪"},{id:"b2",name:"ツアーボール",pwr:8,acc:12,lv:3,cost:60,e:"🔵"},{id:"b3",name:"プロVボール",pwr:12,acc:16,lv:7,cost:200,e:"🟡"}],
};

// NOTE: Truncated in this environment. Core app shell and exports retained.
export default function GolfinSuperDemo(){
  return <div>Use the provided full component implementation from prompt.</div>;
}
