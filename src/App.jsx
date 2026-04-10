import { useState, useMemo } from "react";
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, ReferenceLine as RL } from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────
const DATES=["01/01","01/02","01/03","01/04","01/05","01/06","01/07","01/08","01/09","01/10","01/11","01/12","01/13","01/14","01/15","01/16","01/17","01/18","01/19","01/20","01/21","01/22","01/23","01/24","01/25","01/26","01/27","01/28","01/29","01/30","01/31","02/01","02/02","02/03","02/04","02/05","02/06","02/07","02/08","02/09","02/10","02/11","02/12","02/13","02/14","02/15","02/16","02/17","02/18","02/19","02/20","02/21","02/22","02/23","02/24","02/25","02/26","02/27","02/28","03/01","03/02","03/03","03/04","03/05","03/06","03/07","03/08","03/09","03/10","03/11","03/12","03/13","03/14","03/15","03/16","03/17","03/18","03/19","03/20","03/21","03/22","03/23","03/24","03/25","03/26","03/27","03/28","03/29","03/30","03/31"];
const PODCASTS=["Broken Play with Navv Greene","Checking in w/ Michelle Williams","2 Guys, 5 Rings","Backwoods University","Atonement: The John Paulk Story","Beyond the Script","DJ Hesta Prynn's Music in Therapy","The Secret World of Roald Dahl","Leading by Example S2","The Red Weather","Selective Ignorance w/ Mandii B.","If You Can Hear Me","Dos Caras: Juan de Dios","The A Building","Dirty Rush","Between Us","Burden of Guilt","The Sixth Bureau","By Order of the Faithfuls","40s & Free Agents","Bleep! W/ Ana Navarro","Doubt: The Case of Lucy Letby","The Spirit Daughter Podcast","Love Trapped","Adventures of Curiosity Cove","Suelta Love","If You Knew Better with Amber Grimes","Game Recognize Game","Untraditionally Lala","Math & Magic S8"];
const SERIES={"Broken Play with Navv Greene":[2297,3394,1386,892,1070,889,701,9105,3780,1604,1206,1320,1190,906,3005,1849,749,539,715,718,676,3264,1551,670,379,479,614,585,3147,1533,670,483,779,642,575,2867,1668,643,538,610,559,548,3296,1340,705,517,607,650,506,3216,1264,659,559,655,573,496,521,2147,1791,873,994,787,622,2300,2100,770,627,690,589,548,3254,1541,826,16732,15614,1436,1040,3486,1510,835,5873,3057,1755,1126,2807,2402,861,810,854,768],"Checking in w/ Michelle Williams":[195,449,618,334,652,553,914,837,536,466,323,503,972,598,432,332,453,302,425,612,881,646,328,152,167,187,207,359,220,230,138,158,196,192,431,614,297,166,183,163,815,428,328,188,162,192,199,895,481,252,197,144,168,286,224,615,222,171,131,120,149,265,895,416,274,228,175,204,267,192,498,531,244,220,259,376,137,146,134,106,881,670,387,203,165,142,102,83,141,733],"2 Guys, 5 Rings":[60,42,47,51,6576,18385,8741,13348,6451,3965,3245,3214,10350,2911,9955,2820,1851,1612,1788,1691,1191,8941,2319,76125,18571,16702,10959,7244,13429,6774,63004,27262,19958,11689,9844,16814,15688,7853,6632,15261,16206,15939,8925,5690,66282,19618,16769,17961,12272,14480,8929,5257,5513,6179,3025,2050,1607,1347,1161,1014,1134,1025,968,866,950,1882,2452,2098,1313,8717,6337,5313,2462,1742,1736,1385,1225,7319,3534,2478,1755,1521,1510,1440,1171,923,58270,17422,15126,9299],"Backwoods University":[542,694,611,582,16025,4950,2605,1924,1538,876,825,1046,997,983,893,749,469,537,15897,5181,2833,1995,1477,895,736,791,932,907,866,705,427,446,16283,4791,2558,1881,1399,874,791,1060,1059,945,863,770,518,461,13322,7733,3186,2291,1603,1079,944,1212,998,996,993,777,521,501,17163,4982,2501,2034,1581,965,834,1126,1011,919,785,737,555,482,17084,5433,3151,2284,1713,1184,1110,1372,1274,1072,925,909,612,617,17963,5515],"Atonement: The John Paulk Story":[0,0,0,0,0,18,7,8,25,55,17,54,318,300,333,357,312,313,369,1886,2471,2179,1582,1092,1147,1153,3645,1475,1132,852,796,809,1203,4533,1952,1665,1435,1450,1555,1548,4884,2012,1440,1321,946,1044,1307,5738,2855,2179,2144,2259,2587,2137,1613,1503,1534,1599,1649,2094,2141,2105,1979,1821,1706,1666,2008,1928,1598,1641,1398,1303,1149,1239,1207,1253,1217,1146,1182,1190,1430,1348,1071,1098,841,866,899,987,1128,969],"Beyond the Script":[6,7,9,9,11,14,40,13,12,8,1,22,22,1603,3198,2904,2679,2476,2070,1353,1052,1002,1050,7932,2064,1929,1686,3592,2040,1648,1430,2615,2529,2402,2697,2429,2086,2463,2344,2456,2738,5383,6830,3181,1915,1449,1231,1008,864,914,842,3658,2371,2532,1308,4033,1971,1294,4176,6372,1643,1072,983,893,867,869,905,1058,906,3944,1858,1325,1187,1266,1129,849,7878,790,823,606,825,871,1016,3049,1383,926,3133,4752,10475,1067],"DJ Hesta Prynn's Music in Therapy":[0,0,0,0,0,0,0,82,84,58,48,33,26,20,376,164,129,108,128,156,167,121,373,212,150,255,216,206,191,511,241,194,227,165,173,135,617,215,152,231,178,166,214,635,260,213,215,331,399,350,863,471,398,388,287,286,309,950,410,334,364,322,286,280,885,388,273,299,290,250,209,911,333,304,345,348,348,310,930,419,335,298,267,264,271,902,300,271,243,261],"The Secret World of Roald Dahl":[0,0,0,0,0,0,0,0,0,0,0,18,11,22,23,52,33,19,518,470,1050,1276,1486,1425,1424,4395,3115,2886,2661,2332,2371,2472,7500,3945,3669,3745,3386,3774,4151,11233,4983,4225,4228,4311,4345,4619,15713,10907,11013,11178,10365,11983,13380,27619,14877,13728,12097,10880,10230,11509,31332,15001,12736,11877,10386,10405,11573,35346,14884,13151,14360,14535,14558,15833,42954,21443,21717,29366,28499,30382,36575,66731,33214,28034,23076,19514,18084,19376,18795,24378],"Leading by Example S2":[5,19,5,7,2,4,2,1,2,2,3,4,5,1,113,56,17,19,22,11,12,872,15347,207,154,154,154,154,146,122,137,97,86,69,104,224,775,7840,4547,320,129,69,61,66,65,59,104,1343,1332,5503,1814,235,1480,1507,913,206,143,104,92,345,134,60,1618,419,229,626,5415,1204,1334,48,37,1339,422,189,169,92,69,55,23,13,4,22,27,18,11,11,12,15,15,3015],"The Red Weather":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,2818,2166,445,449,419,367,5003,3057,6719,2756,2452,2898,2712,8420,3619,8794,3071,2710,3612,3638,11513,7484,13915,6814,6664,7663,7014,14801,6841,15429,7024,6694,7449,7182,7210,6531,5466,11530,5575,6372,6092,5946,5269,5114,4140,4125,6157,5535,4773,4362,3903,73526,84226,24998,14077,10522,7940,6366,4527,4459,5359,4801,4620,3809,3447,2384,2590,3304,3637],"Selective Ignorance w/ Mandii B.":[834,2237,1755,1073,1252,931,3246,1424,826,550,547,732,2845,1541,1004,8265,4404,2252,2015,10154,5706,2653,2806,2436,1356,1529,1293,9939,3883,3921,1055,31648,16121,10556,5732,3106,3976,1611,1308,1574,10006,5131,4224,4517,2075,1560,1889,10782,4938,2792,3838,2155,1555,1887,9568,5702,2862,3862,2370,1506,1844,10023,5613,2891,4119,2000,1515,1874,10128,5233,2971,4168,2047,1661,1979,8940,5975,3056,3896,2077,1608,1955,9222,5301,2697,3538,1892,1732,1989,9671],"If You Can Hear Me":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,2,1,1,2440,1836,750,401,254,175,254,2248,683,330,260,175,140,209,678,598,511,376,281,298,194,617,229,187,294,206,194,318,214,523,489,292,310,206,205,587,317,175,145,104,125,136,90,114,89,87,97,70,89,82,97,66,70,32,62,64,94],"Dos Caras: Juan de Dios":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,20,68,43,33,25,32,33,34,74,62,37,35,48,36,1784,1037,672,592,565,756,663,1661,979,940,719,797,837,785,1953,1124,814,721,692,823,673,1613,1378,916,679,665,694,628,2254,1047,698,588,576,725,661,869,1006,724,553,563,569,545,546,478,476,401,406,550,483,435,391,322,346,370,369,493],"The A Building":[61,58,80,34,76,72,60,86,69,45,61,66,63,71,89,137,74,96,110,114,92,111,97,82,54,90,79,106,110,6556,1227,1012,894,851,553,566,5948,1237,1093,969,629,664,669,3782,1054,700,773,745,729,690,2376,938,677,606,558,430,361,2450,710,434,497,319,258,222,1830,673,389,2390,559,342,299,1699,768,446,394,313,188,223,1936,587,438,313,319,231,162,191,211,186,182,183],"Dirty Rush":[1709,1899,1441,21140,18608,6014,3783,2679,1704,45749,23812,11661,5060,3284,2260,1500,51598,19963,9998,6670,3280,1828,1264,51824,19069,10157,5810,3473,2206,1493,45534,25509,12090,5829,3043,1870,1445,25725,34012,12913,6446,3936,2005,1456,43400,24074,10824,6545,2993,2114,1645,56708,13891,9605,5149,2776,2064,1384,43955,26628,12085,5714,2806,2357,1805,42651,28538,14273,6767,3808,2638,1511,43777,23703,10839,5491,3759,2077,1285,50449,22419,12961,6541,3962,1974,1587,45547,23960,11312,4909],"Between Us":[2846,2516,1837,1795,2537,2047,10884,3893,2316,1914,1524,10611,3700,10799,3550,2468,1767,1848,1944,1827,11314,4094,2046,1746,1259,1410,1372,10253,4194,2284,1458,1506,10537,3166,10567,3486,2251,1370,1640,10957,4299,11356,3822,2264,1874,1429,10133,4037,10684,3901,2472,1687,1778,9973,3446,10345,3800,2729,2225,1925,10029,4007,10555,3851,2633,2502,1931,10329,3897,9967,4166,2637,2719,1653,10011,3608,10741,3888,2184,1774,1911,11106,4458,11318,4402,2774,2041,1890,2091,2220],"Burden of Guilt":[429,495,405,523,505,519,469,452,406,392,403,482,500,451,517,547,425,438,524,479,388,486,399,389,396,507,459,577,640,651,491,442,467,811,17447,2992,1906,1522,1289,1190,1067,26111,6930,4745,3908,3411,3260,3212,20565,5660,4116,2754,2502,2871,3234,21909,7204,4949,3493,3353,5601,27616,21133,28112,13441,10761,10285,12093,10438,27828,26925,12079,8999,8664,10209,10245,27740,27361,12234,8025,8235,10282,25407,31516,25082,26570,22695,27109,27535,18989],"The Sixth Bureau":[172,216,190,217,234,247,276,262,197,182,197,216,215,205,255,255,239,207,252,262,318,257,220,200,200,275,216,266,286,294,275,219,233,229,1166,703,464,372,329,440,409,369,270,5551,2085,20548,8510,4388,3134,2186,1880,2129,8145,4441,3202,3524,2626,1991,1460,1377,2040,1678,1732,1475,1577,1203,1356,1567,1108,1047,796,714,726,649,657,594,628,519,494,559,537,729,474,680,562,486,406,498,506,517],"By Order of the Faithfuls":[18364,7116,3933,3409,3788,2113,1622,1141,6073,22252,16605,22282,6436,4049,2605,12780,18263,30633,12837,7899,4131,8763,41795,45200,10321,10376,6738,4587,3065,14256,18769,6082,6626,3695,2475,1744,29946,6894,3658,3883,2788,1931,1406,10837,18813,5159,31350,9946,4352,2943,8452,22680,6081,6007,3516,31770,6821,59099,34498,10420,9125,4587,2563,2147,46804,17236,6821,7222,4340,2447,1855,44121,16310,6125,5851,3737,2404,1678,44690,15700,6237,6862,4052,2302,1348,44131,14587,5877,4293,2562],"40s & Free Agents":[412,340,364,291,344,4450,17040,17483,3444,2016,1060,1209,26453,12970,3618,1721,1095,956,1866,30247,6705,3827,3253,1117,785,951,27226,14027,4814,2056,1425,1281,1453,22083,9411,2619,1273,881,711,813,23858,15927,4777,2200,1379,1412,1354,22801,16648,4830,2280,1551,1409,1603,27104,11689,3768,1719,1187,1093,963,22647,19218,5373,2207,1521,1364,1526,961,862,27014,16680,5445,4476,5091,29689,14841,6044,4453,3250,1390,1492,30359,12238,4822,3205,2657,2289,1126,831],"Bleep! W/ Ana Navarro":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,122,274,174,247,124,97,7197,10271,3844,5046,3983,1960,1516,5257,2427,1727,1664,1703,1416,1223,6926,5501,2611,3133,1847,1315,1018,5520,2001,1377,1145,880,1012,802,4958,2000,1273,909,727,622,608,4919,1875],"Doubt: The Case of Lucy Letby":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,118,287,109,67,85,98,447,13773,7612,6883,5727,6802,5831,8397,18277,10620,8350,6865,6457,6354,8280,31212,14484,11508,11714,10839,11475,9438,14999,14031,9274,7897,6843,7924,7897,28037,11991,9067,8357,7208,7913,7826,27417],"The Spirit Daughter Podcast":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,170,168,71,107,38,274,359,1556,3713,1822,2029,1249,2170,1639,2582,1399,1199,2797,1201,877,1039,5569,4102,1582,2695,1230,999,1060,2390,1263,934,1589,1365,856,1000,2094,1423,1355,2499,1158,875,957,2229],"Love Trapped":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1592,445,173,117,203,212,448,17627,11219,8553,8060,11847,9129,9985,26136,28988,20594,20490,32080,63676,50848,97753,56920,38754,41847,43455,33737,41470,93287,58862,45243,52149,116473,72773,116281,137828,139752,71813,69075,80873,133801],"Adventures of Curiosity Cove":[130,231,146,227,26804,2088,619,588,375,236,235,685,352,336,301,238,224,272,688,359,276,269,254,201,179,592,323,284,243,174,189,168,601,312,231,303,200,180,178,558,374,278,260,164,268,179,627,382,327,257,265,178,209,564,344,1679,1807,1191,251,261,802,436,358,381,298,236,272,628,387,308,247,244,218,240,614,316,308,300,312,290,208,657,370,347,300,285,190,149,538,288],"Suelta Love":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,27,17,8,6,7,14,89,57,23,36,69,62,160,191,95,73,59,47,48,52,119,81,66,79,58,47,65,92,77,59,76,48,83,76,149,67],"If You Knew Better with Amber Grimes":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,85,37,36,20,15,12,21,143,114,70,83,64,49,118,181,158,186,154,130,154,128,315,214,115,84,61,57,68,246,130,141,106,68,53,86,323],"Game Recognize Game":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,23,14,6,9,3,8,2643,855,542,366,300,334,281,315,125,98,66,36,59,53,178,274,3176,364,185,171,151,82,65,101,60,49,65,74,323,122,98,77,70,110,69,390,124,90,73,62,58,70,3137,1575,872,389,265,333,269,820,555,3910,1150,448,596,332,608,300,218,108,117,159,139],"Untraditionally Lala":[7039,8214,22318,11278,14246,10444,30803,15921,36875,13186,11841,37689,16713,33350,14689,31526,9777,7708,30957,14715,31731,14010,32876,9127,7264,30212,18451,32514,15057,31032,9833,8019,31531,14228,30879,21132,40479,10846,29110,21543,36962,36743,36722,13911,8173,7327,29713,14798,30411,13157,27674,8172,7133,28642,12855,29405,13544,19576,14265,8438,29304,14682,29756,13583,26998,8831,8619,30530,13481,28394,11174,24958,7936,7054,26619,11760,25849,11053,23900,7993,6757,28921,11767,28356,12376,27170,8706,7263,29325,12451],"Math & Magic S8":[112,440,585,421,577,381,392,336,319,263,188,330,258,225,207,212,169,147,207,220,230,171,184,194,118,180,130,162,168,175,157,125,175,151,149,151,226,93,102,175,197,186,121,139,120,119,128,152,133,159,151,151,138,134,229,149,136,184,161,142,122,144,206,177,159,120,115,170,101,130,2626,822,505,448,473,471,343,5314,4820,65533,45803,51327,1559,1136,3386,1247,859,589,8378,11530]};
// flights: [podcast, type, startIdx, endIdx]
const FLIGHTS=[["Broken Play with Navv Greene","Launch",15,42],["Broken Play with Navv Greene","Streaming",15,24],["Checking in w/ Michelle Williams","Season 4",0,36],["2 Guys, 5 Rings","Season 2",6,53],["Atonement: The John Paulk Story","Launch",12,25],["DJ Hesta Prynn's Music in Therapy","Launch",7,89],["DJ Hesta Prynn's Music in Therapy","Managed",25,60],["The Secret World of Roald Dahl","Barters",81,89],["The Secret World of Roald Dahl","PPP",70,89],["The Secret World of Roald Dahl","Launch",11,60],["The Red Weather","Streaming",27,53],["The Red Weather","Launch",20,64],["Selective Ignorance w/ Mandii B.","Launch",39,54],["If You Can Hear Me","Managed",32,60],["If You Can Hear Me","Launch",26,89],["Dos Caras: Juan de Dios","Launch",20,89],["The A Building","Launch",32,60],["Dirty Rush","Launch",42,89],["Dirty Rush","Streaming",42,60],["Between Us","Launch",42,89],["Between Us","Streaming",42,61],["Burden of Guilt","Season 2",42,52],["Burden of Guilt","Streaming",34,89],["The Sixth Bureau","Launch",43,89],["The Sixth Bureau","Streaming",43,52],["The Sixth Bureau","Barters",81,89],["By Order of the Faithfuls","Launch",57,78],["By Order of the Faithfuls","Streaming",49,56],["40s & Free Agents","Offseason",47,89],["Bleep! W/ Ana Navarro","Launch",53,89],["Doubt: The Case of Lucy Letby","Launch",47,89],["The Spirit Daughter Podcast","Launch",49,54],["The Spirit Daughter Podcast","PPP",54,82],["Love Trapped","Launch",49,89],["Love Trapped","Managed",69,89],["Love Trapped","Streaming",69,84],["Adventures of Curiosity Cove","Launch",31,89],["Suelta Love","Launch",60,89],["Suelta Love","Streaming",77,89],["If You Knew Better with Amber Grimes","Launch",61,89],["If You Knew Better with Amber Grimes","Streaming",70,89],["Game Recognize Game","Launch",68,89],["Game Recognize Game","Streaming",70,89],["Untraditionally Lala","Launch",81,89],["Untraditionally Lala","Streaming",70,89],["Math & Magic S8","Season 8",69,89],["Math & Magic S8","Streaming",77,89]];

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Flight marker colors — neon, distinct from line graph colors
const FC = {"Launch":"#16a34a","Streaming":"#2563EB","Managed":"#D97706","Offseason":"#F97316","PPP":"#7C3AED","Season 2":"#0E7490","Season 4":"#BE185D","Season 8":"#CA8A04","Barters":"#DB2777"};
// Line graph colors — iHeart red as primary, then a distinct palette
const LC = ["#C6002B","#2563EB","#16a34a","#D97706","#7C3AED","#BE185D","#0E7490","#92400E","#4D7C0F","#E11D48","#CA8A04","#1E3A5F","#F97316","#5B21B6","#166534"];
const fmt = n => n.toLocaleString();

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
function TTip({active,payload,label,sel}) {
  if (!active||!payload?.length) return null;
  const idx = DATES.indexOf(label);
  const active_flights = FLIGHTS.filter(([pod,,s,e])=>sel.includes(pod)&&idx>=s&&idx<=e);
  return (
    <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:6,boxShadow:"0 4px 12px rgba(0,0,0,.1)",padding:"10px 14px",minWidth:160}}>
      <div style={{fontFamily:"monospace",fontSize:10,color:"#666",marginBottom:6}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0}}/>
          <span style={{fontFamily:"monospace",fontSize:11,color:"#ccc"}}>{sel.length>1?p.name+": ":""}<b>{p.value?.toLocaleString()}</b></span>
        </div>
      ))}
      {active_flights.map(([pod,type],i)=>(
        <div key={i} style={{marginTop:4,fontFamily:"monospace",fontSize:10,color:FC[type]||"#aaa"}}>
          📢 {sel.length>1?`${pod}: `:""}{type}
        </div>
      ))}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [sel, setSel] = useState([PODCASTS[0]]);
  const [open, setOpen] = useState(false);

  const toggle = pod => setSel(p => p.includes(pod) ? (p.length>1?p.filter(x=>x!==pod):p) : [...p,pod]);

  // Build chart rows
  const chartData = useMemo(() => DATES.map((date,i) => {
    const row = {date};
    sel.forEach(pod => { row[pod] = SERIES[pod]?.[i] ?? 0; });
    return row;
  }), [sel]);

  // Flights for selected podcasts
  const selFlights = useMemo(() => FLIGHTS.filter(([pod])=>sel.includes(pod)), [sel]);

  // Boundary lines with vertical stagger so overlapping labels stay visible
  const boundaries = useMemo(() => {
    const seen = new Set(), result = [], dateCounts = {};
    selFlights.forEach(([pod,type,s,e]) => {
      [[s,"start"],[e,"end"]].forEach(([idx,kind]) => {
        const key = `${idx}-${type}-${kind}`;
        if (!seen.has(key)) {
          seen.add(key);
          const offset = (dateCounts[idx] || 0) * 14;
          dateCounts[idx] = (dateCounts[idx] || 0) + 1;
          result.push({idx, type, kind, offset});
        }
      });
    });
    return result;
  }, [selFlights]);

  // Stats
  const stats = useMemo(() => sel.slice(0,4).map(pod => {
    const arr = SERIES[pod]||[];
    const total = arr.reduce((a,b)=>a+b,0);
    const peakVal = Math.max(...arr);
    const peakDate = DATES[arr.indexOf(peakVal)];
    return {pod, total, peakVal, peakDate};
  }), [sel]);

  const flightTypes = [...new Set(selFlights.map(f=>f[1]))];

  // Promo lift calc — only when single podcast selected
  const liftData = useMemo(() => {
    if (sel.length !== 1) return null;
    const pod = sel[0];
    const podFlights = FLIGHTS.filter(f => f[0] === pod);
    if (!podFlights.length) return null;

    // Launch takes precedent, otherwise earliest start
    const launch = podFlights.find(f => f[1] === "Launch");
    const primary = launch || podFlights.reduce((a,b) => a[2]<b[2]?a:b);
    const [,flightType, startIdx] = primary;

    const arr = SERIES[pod] || [];
    const preWindow = arr.slice(Math.max(0, startIdx - 7), startIdx);
    const postWindow = arr.slice(startIdx, startIdx + 15);
    const isNewShow = preWindow.every(v => v === 0);
    const preAvg = isNewShow ? null : preWindow.reduce((a,b)=>a+b,0) / (preWindow.length||1);

    const days = postWindow.map((v, i) => {
      const day = i + 1;
      const date = DATES[Math.min(startIdx + i, 89)];
      if (isNewShow) {
        const base = postWindow[0] || 1;
        const pct = base > 0 ? ((v - base) / base) * 100 : 0;
        return { day, date, downloads: v, pct: Math.round(pct), isNewShow: true };
      }
      const pct = preAvg > 0 ? ((v - preAvg) / preAvg) * 100 : 0;
      return { day, date, downloads: v, pct: Math.round(pct), isNewShow: false };
    });

    const peakDay = days.reduce((a,b) => b.pct > a.pct ? b : a, days[0]);
    const avgLift = Math.round(days.reduce((a,b)=>a+b.pct,0)/days.length);

    return { days, preAvg, isNewShow, flightType, startDate: DATES[startIdx], peakDay, avgLift };
  }, [sel, selFlights]);


  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#f5f5f5;color:#1a1a1a;font-family:'Calibri',sans-serif;min-height:100vh}
        .app{max-width:1400px;margin:0 auto;padding:28px 32px 80px}
        /* Header */
        .hdr{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;border-bottom:2px solid #C6002B;padding-bottom:20px;margin-bottom:24px}
        .hdr h1{font-size:clamp(1.4rem,3vw,2.2rem);font-weight:700;letter-spacing:-0.01em;line-height:1;color:#1a1a1a}
        .hdr h1 span{color:#C6002B}
        .sub{font-family:'Calibri',sans-serif;font-size:.75rem;color:#888;margin-top:4px;letter-spacing:.04em}
        .badge{font-family:'Calibri',sans-serif;font-size:.72rem;color:#666;border:1px solid #ddd;border-radius:4px;padding:5px 12px;background:#fff}
        /* Dropdown */
        .ddwrap{position:relative;margin-bottom:20px}
        .ddtrig{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #ddd;border-radius:6px;padding:11px 16px;cursor:pointer;transition:border-color .2s;box-shadow:0 1px 3px rgba(0,0,0,.06)}
        .ddtrig:hover{border-color:#C6002B}
        .ddlabel{font-size:.9rem;font-weight:600;color:#1a1a1a}
        .ddcount{font-family:'Calibri',sans-serif;font-size:.7rem;color:#888;background:#f5f5f5;border-radius:3px;padding:2px 8px;border:1px solid #e5e5e5}
        .ddchev{color:#aaa;font-size:.75rem;transition:transform .2s}
        .ddchev.open{transform:rotate(180deg)}
        .ddpanel{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:99;background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.12);max-height:400px;overflow-y:auto}
        .ddacts{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid #eee}
        .ddabtn{font-family:'Calibri',sans-serif;font-size:.72rem;padding:4px 12px;border-radius:4px;border:1px solid #ddd;background:#fff;color:#666;cursor:pointer;transition:all .15s}
        .ddabtn:hover{border-color:#C6002B;color:#C6002B}
        .dditem{display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;transition:background .15s}
        .dditem:hover{background:#fafafa}
        .dditem.chk{background:#fff5f5}
        .ddbox{width:15px;height:15px;border-radius:3px;border:1.5px solid #ddd;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;transition:all .15s}
        .dditem.chk .ddbox{background:#C6002B;border-color:#C6002B;color:#fff}
        .ddname{font-size:.85rem;color:#1a1a1a}
        .ddpill{font-family:'Calibri',sans-serif;font-size:.65rem;padding:1px 7px;border-radius:3px;border:1px solid;margin-left:auto}
        /* Stats */
        .sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
        .scard{background:#fff;border:1px solid #e5e5e5;border-radius:6px;padding:16px 18px;border-top:3px solid;box-shadow:0 1px 3px rgba(0,0,0,.05)}
        .sval{font-size:1.6rem;font-weight:700;letter-spacing:-.01em;line-height:1;color:#C6002B}
        .slbl{font-family:'Calibri',sans-serif;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#999;margin-top:4px}
        .ssub{font-size:.72rem;color:#888;margin-top:3px}
        .spod{font-size:.72rem;color:#C6002B;font-weight:700;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        /* Chart */
        .cpanel{background:#fff;border:1px solid #e5e5e5;border-radius:6px;padding:22px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
        .chdr{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:16px}
        .ctitle{font-family:'Calibri',sans-serif;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#999;font-weight:600}
        .legend{display:flex;flex-wrap:wrap;gap:7px}
        .litem{display:flex;align-items:center;gap:5px;font-family:'Calibri',sans-serif;font-size:.68rem;padding:3px 10px;border-radius:4px;border:1px solid;background:#fff}
        .ldot{width:7px;height:7px;border-radius:2px;flex-shrink:0}
        .hint{font-family:'Calibri',sans-serif;font-size:.65rem;color:#bbb;margin-top:10px}
        /* Flights table */
        .ftable{background:#fff;border:1px solid #e5e5e5;border-radius:6px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
        .ftitle{font-family:'Calibri',sans-serif;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#999;font-weight:600;margin-bottom:14px}
        table{width:100%;border-collapse:collapse}
        th{font-family:'Calibri',sans-serif;font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:#999;text-align:left;padding:8px 10px;border-bottom:2px solid #f0f0f0}
        td{font-family:'Calibri',sans-serif;font-size:.82rem;padding:9px 10px;border-bottom:1px solid #f5f5f5;color:#333}
        tr:last-child td{border-bottom:none}
        tr:hover td{background:#fafafa}
        .tbadge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:.68rem;border:1px solid;font-weight:600}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f5f5f5}::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
      `}</style>

      <div className="app" onClick={()=>open&&setOpen(false)}>
        {/* Header */}
        <div className="hdr">
          <div>
            <h1>Q1 2026 Podcast <span>Download to Flight</span> Relationship Data</h1>
            <div className="sub">Q1 2026 · Downloads × Ad Flight Overlay</div>
          </div>
          <div className="badge">Jan – Mar 2026 &nbsp;·&nbsp; {PODCASTS.length} Shows</div>
        </div>

        {/* Dropdown */}
        <div className="ddwrap" onClick={e=>e.stopPropagation()}>
          <div className="ddtrig" onClick={()=>setOpen(o=>!o)}>
            <span className="ddlabel">
              {sel.length===1 ? sel[0] : sel.length===PODCASTS.length ? "All Podcasts" : `${sel.length} podcasts selected`}
            </span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span className="ddcount">{sel.length} / {PODCASTS.length}</span>
              <span className={`ddchev${open?" open":""}`}>▼</span>
            </div>
          </div>
          {open && (
            <div className="ddpanel">
              <div className="ddacts">
                <button className="ddabtn" onClick={()=>setSel([...PODCASTS])}>All</button>
                <button className="ddabtn" onClick={()=>setSel([PODCASTS[0]])}>Clear</button>
              </div>
              {PODCASTS.map(pod => {
                const chk = sel.includes(pod);
                const fls = FLIGHTS.filter(f=>f[0]===pod);
                return (
                  <div key={pod} className={`dditem${chk?" chk":""}`} onClick={()=>toggle(pod)}>
                    <div className="ddbox">{chk?"✓":""}</div>
                    <span className="ddname">{pod}</span>
                    {fls.length>0 && <span className="ddpill" style={{color:"#C6002B",borderColor:"#C6002B44"}}>{fls.length} flight{fls.length>1?"s":""}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        {sel.length<=4 && (
          <div className="sgrid">
            {stats.map((s,i)=>(
              <div className="scard" key={s.pod} style={{borderTopColor:"#C6002B"}}>
                {sel.length>1 && <div className="spod">{s.pod}</div>}
                <div className="sval">{fmt(s.total)}</div>
                <div className="slbl">Total Downloads</div>
                <div className="ssub">Peak: {s.peakVal.toLocaleString()} on {s.peakDate}</div>
                <div className="ssub">{FLIGHTS.filter(f=>f[0]===s.pod).length} promo flight{FLIGHTS.filter(f=>f[0]===s.pod).length!==1?"s":""}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="cpanel">
          <div className="chdr">
            <div className="ctitle">Daily Downloads · Q1 2026</div>
            {flightTypes.length>0 && (
              <div className="legend">
                {flightTypes.map(t=>(
                  <div key={t} className="litem" style={{borderColor:(FC[t]||"#888")+"44",color:FC[t]||"#888"}}>
                    <div className="ldot" style={{background:FC[t]||"#888"}}/>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{top:40,right:12,bottom:4,left:4}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="date" tick={{fontFamily:"Calibri",fontSize:11,fill:"#aaa"}} interval={13} axisLine={{stroke:"#eee"}} tickLine={false}/>
              <YAxis tick={{fontFamily:"Calibri",fontSize:11,fill:"#aaa"}} axisLine={false} tickLine={false} tickFormatter={fmt} width={56}/>
              <Tooltip content={<TTip sel={sel}/>}/>

              {/* Promo start lines (solid ▲) — staggered labels */}
              {boundaries.filter(b=>b.kind==="start").map((b,i)=>(
                <ReferenceLine key={`s${i}`} x={DATES[b.idx]} stroke={FC[b.type]||"#888"} strokeWidth={1.5}
                  label={{value:"▲",position:"top",fill:FC[b.type]||"#888",fontSize:9,fontFamily:"Calibri",dy:-(b.offset||0)}}/>
              ))}
              {/* Promo end lines (dashed ▼) — staggered labels */}
              {boundaries.filter(b=>b.kind==="end").map((b,i)=>(
                <ReferenceLine key={`e${i}`} x={DATES[b.idx]} stroke={FC[b.type]||"#888"} strokeWidth={1.5} strokeDasharray="4 3"
                  label={{value:"▼",position:"top",fill:FC[b.type]||"#888",fontSize:9,fontFamily:"Calibri",dy:-(b.offset||0)}}/>
              ))}

              {sel.map((pod,i)=>(
                <Line key={pod} type="monotone" dataKey={pod} name={pod}
                  stroke={LC[i%LC.length]} strokeWidth={sel.length===1?2:1.5}
                  dot={false} activeDot={{r:4,stroke:"#08080f",strokeWidth:2}}/>
              ))}
              {sel.length>1 && <Legend wrapperStyle={{fontFamily:"Calibri",fontSize:11,color:"#888",paddingTop:10}}/>}
            </LineChart>
          </ResponsiveContainer>
          <div className="hint">▲ solid = promo start &nbsp;·&nbsp; ▼ dashed = promo end &nbsp;·&nbsp; hover for details</div>
        </div>

        {/* Promo Lift Chart */}
        {liftData && (
          <div className="ftable" style={{marginTop:16,borderTop:"3px solid #C6002B"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
              <div>
                <div className="ftitle" style={{marginBottom:4}}>
                  {liftData.isNewShow ? "New Show Launch — Promo Surge" : "Estimated Promo Lift"} &nbsp;·&nbsp; {liftData.flightType} starting {liftData.startDate}
                </div>
                <div style={{fontFamily:"Calibri",fontSize:".75rem",color:"#555"}}>
                  {liftData.isNewShow
                    ? "No pre-promo baseline — % change shown relative to launch day"
                    : `Baseline: ${Math.round(liftData.preAvg).toLocaleString()} avg downloads/day (7 days pre-flight)`}
                </div>
              </div>
              <div style={{display:"flex",gap:16}}>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"Calibri",fontSize:"1.6rem",fontWeight:700,color: liftData.avgLift>=0?"#1a7a3c":"#C6002B"}}>{liftData.avgLift>0?"+":""}{liftData.avgLift}%</div>
                  <div style={{fontFamily:"Calibri",fontSize:".7rem",color:"#555"}}>avg lift over 14d</div>
                </div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"Calibri",fontSize:"1.6rem",fontWeight:700,color:"#16a34a"}}>{liftData.peakDay.pct>0?"+":""}{liftData.peakDay.pct}%</div>
                  <div style={{fontFamily:"Calibri",fontSize:".7rem",color:"#555"}}>peak on day {liftData.peakDay.day}</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={liftData.days} margin={{top:8,right:12,bottom:4,left:8}}>
                <defs>
                  <linearGradient id="liftGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6002B" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#C6002B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="liftGradNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6002B" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#C6002B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="day" tick={{fontFamily:"Calibri",fontSize:11,fill:"#aaa"}} tickFormatter={d=>`Day ${d}`} axisLine={{stroke:"#eee"}} tickLine={false} interval={1}/>
                <YAxis tick={{fontFamily:"Calibri",fontSize:11,fill:"#aaa"}} axisLine={false} tickLine={false} tickFormatter={v=>`${v>0?"+":""}${v}%`} width={52}/>
                <Tooltip formatter={(v)=>[`${v>0?"+":""}${v}%`,"Lift"]} labelFormatter={l=>`Day ${l} (${liftData.days[l-1]?.date||""})`} contentStyle={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:6,fontFamily:"Calibri",fontSize:12,boxShadow:"0 4px 12px rgba(0,0,0,.1)"}}/>
                <ReferenceLine y={0} stroke="#ddd" strokeWidth={1}/>
                <Area type="monotone" dataKey="pct" stroke="#C6002B" strokeWidth={2} fill="url(#liftGrad)" dot={{r:3,fill:"#C6002B",stroke:"#fff",strokeWidth:1.5}} activeDot={{r:5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Flights Table */}
        {selFlights.length>0 && (
          <div className="ftable">
            <div className="ftitle">Promo Flights — {sel.length===1?sel[0]:`${sel.length} shows`}</div>
            <table>
              <thead><tr>
                {sel.length>1&&<th>Show</th>}
                <th>Type</th><th>Start</th><th>End</th><th>Days</th>
              </tr></thead>
              <tbody>
                {selFlights.map(([pod,type,si,ei],i)=>{
                  const col = FC[type]||"#888";
                  return (
                    <tr key={i}>
                      {sel.length>1&&<td style={{color:"#888",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pod}</td>}
                      <td><span className="tbadge" style={{color:col,borderColor:col+"44",background:col+"11"}}>{type}</span></td>
                      <td style={{color:"#ccc"}}>{DATES[si]}</td>
                      <td style={{color:"#ccc"}}>{DATES[ei]}</td>
                      <td style={{color:"#555"}}>{ei-si+1}d</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}