import express, { response } from "express";
import cheerio from "cheerio";
import request from "request-promise";
import axios from "axios";
import cors from "cors";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

const PORT=4000;

 //Mongodb connection
 //const MONGO_URL="mongodb://127.0.0.1";
 const MONGO_URL=process.env.MONGO_URL;
 async function createConnection(){
  const client=new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected😃");
  return client;
 }
 const client= await createConnection();

app.get("/",function(request,response){
    response.send("hi world");
});
app.listen(PORT, ()=>console.log
('Server started🙂')
);
       
//const url="https://www.amazon.in/dp/B0B4F2TTTS";

 app.get('/',function(req,res){
    res.json('Webscraper')                                               
 })  

  //Get Amazon details
  let amazon_product_details=[];
   app.get('/amzn_data',async (request,response)=>{
    const website_urls=[
    "https://www.amazon.in/dp/B07PDYW7VS",
    "https://www.amazon.in/dp/B00W56GLOQ",
    "https://www.amazon.in/dp/B00935M9H0",
    "https://www.amazon.in/dp/B06Y6DX2TZ",
    "https://www.amazon.in/dp/B08DBKH42B",
    "https://www.amazon.in/dp/B0987TLG66",
    "https://www.amazon.in/dp/B08QWZCV8R",
    "https://www.amazon.in/dp/B09DNY91KR",
    "https://www.amazon.in/dp/B09CSXWNWC",
    "https://www.amazon.in/dp/B09JSH94QT"
    ];
    
    const final_result=[];
    let amazon_product_details1=[];
                 var amazon_details=[];
    
        for(let i=0;i<website_urls.length; i++){
       const url=website_urls[i];
  
     let getData= await axios(url).then(response=>{ 
          const html=response.data;
          const $ = cheerio.load(html);
         const articles=[];
         const ratings=[];
          $('.a-offscreen',html).each(function(){
              const price=$(this).text();
                  articles.push(price
              );
             
          });
     
         $('.a-icon-alt',html).each(function(){
                   const rating=$(this).text();
                    ratings.push(rating
                    );
         });
         if(!articles[6].includes("₹")){
          articles[6]==articles[0];
         }
         if(!ratings[0].includes("stars")){
          ratings[0]="Rating unavailable";
         }
         amazon_product_details.push({"id":i+1,"price":articles[6],"offer_price": articles[0],"rating":ratings[0],"url":url}); 
         
  }).catch(err=>console.log(err));
}
console.log(amazon_product_details);
         })
//post amazon data into db
app.post("/amzn_data_post", async function(request,response){
  const data=request.body;
  console.log(data);
  const result_amazon=await client
                            .db("Ecommerce_web_scrapping")
                            .collection("amazon_products")
                            .insertMany(data);
  response.send(result_amazon);
                      
});

//Get Flipkart details
let flipkart_product_details=[];
app.get('/flpkrt_data',async (request,response)=>{
 const fk_website_urls=[
 "https://www.flipkart.com/wonderchef-vietri-blue-500-mixer-grinder-3-jars-blue/p/itm238e10b0e654c?pid=MIXFFHQVT3ZBRDA3",
 "https://www.flipkart.com/wonderchef-nutri-blend-22000-rpm-mixer-grinder-blender-ss-blades-2-unbreakable-jars-years-warranty-nutri-blend-400-w-juicer-mixer-grinder-2-black/p/itm06dbf1cf12690?pid=MIXE5VSEC4BGAXDD",
 "https://www.flipkart.com/prestige-deluxe-vs-750-w-mixer-grinder-3-jars-red/p/itm4253d3a26b49f?pid=MIXE73KH4KHAKM5R",
 "https://www.flipkart.com/prestige-nakshatra-plus-750-w-mixer-grinder-3-jars-white-red/p/itm7262415459427?pid=MIXEPHYU2WHVZPAQ",
 "https://www.flipkart.com/prestige-stylo-v2-750-juicer-mixer-grinder-3-jars-red-white/p/itmecea537684bd5?pid=MIXFWFZ6ZBURWGBX",
 "https://www.flipkart.com/orpat-kitchen-chef-pro-majestic-yellow-650-mixer-grinder-2-jars-yellow/p/itmc67289d239dd9?pid=MIXGHFJRYEHN9Q5X",
 "https://www.flipkart.com/lifelong-llcmb02-500-w-mixer-grinder-white-3-jars-1100-dry-iron-blue-super-combo/p/itmb906a55df8084?pid=MIXFKDHMZHGZSKYR",
 "https://www.flipkart.com/florita-vinca-450-w-mixer-grinder-3-jars-white/p/itm1c62991ef9dcb?pid=MIXG8YFEDW7QFA9H",
 "https://www.flipkart.com/florita-pine-500-mixer-grinder-3-jars-white/p/itm3fee7d722af71?pid=MIXG8YFT6UHHH4EH",
 "https://www.flipkart.com/pringle-real-juicer-mixer-grinder-jmg-500-2-jars-cherry/p/itm03736199f883b?pid=MIXG7ZP2HSZTJEZU"
 ];
 
 const final_result=[];
 let flipkart_product_details1=[];
              var flipkart_details=[];
 
     for(let i=0;i<fk_website_urls.length; i++){
    const url=fk_website_urls[i];
   // console.log(url);
  let getData= await axios(url).then(response=>{ 
       const html=response.data;
       const $ = cheerio.load(html);
      let price;
      let rating;
      let offer_price;
      let ratings=[];
      let offer_prices=[];
     // 
       $('_30jeq3 ._16Jk6d',html).each(function(){
        console.log("hello");
           offer_price=$(this).text();
               offer_prices.push(offer_price
           );
         console.log(`offer price${offer_prices}`); 
       });
      //  console.log(offer_price);
       $('._2p6lqe',html).each(function(){
         price=$(this).text();
            //articles.push(price
      //  );
       
    });
  
      $('#productRating_LSTMIXG7ZP2HSZTJEZUQAB3MB_MIXG7ZP2HSZTJEZU_._1lRcqv',html).each(function(){
                rating=$(this).text();
                 ratings.push(rating
                 );
      });
      //console.log(rating);
      // if(!articles[6].includes("₹")){
      //  articles[6]==articles[0];
      // }
      // if(!ratings[0].includes("stars")){
      //  ratings[0]="Rating unavailable";
      // }
      flipkart_product_details.push({"id":i+1,"price":price,"offer_price": offer_price,"rating":rating,"url":url}); 
      
}).catch(err=>console.log(err));
}
//console.log(flipkart_product_details);
      })
//post amazon data into db
app.post("/amzn_data_post", async function(request,response){
const data=request.body;
console.log(data);
const result_amazon=await client
                         .db("Ecommerce_web_scrapping")
                         .collection("amazon_products")
                         .insertMany(data);
response.send(result_amazon);
                   
});

 //Get snapdeal details
 let snapdeal_product_details=[];
 app.get('/snpdl_data',async (request,response)=>{
  const website_urls=[
  "https://www.snapdeal.com/product/wonderchef-vietri-blue-500-watt/640678973580#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/wonderchef-nutriblend-2jar-400-watt/640645275380#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/prestige-deluxe-vs-750-mixer/665112631732#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/prestige-nakshatra-plus-750-w/684071756666#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/prestige-stylo-v2-750-watt/660049102342#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/orpat-more-than-500w-mixer/663400225786#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/lifelong-llcmb02-500-watt-3/684256098672#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/florita-vinca-450-watt-2/635040698559#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/florita-pine-500-watt-3/633261845334#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/pringle-real-500-watt-2/654820682456#bcrumbLabelId:243"
  ];
  
  const final_result=[];
  let snapdeal_product_details1=[];
               var snapdeal_details=[];
  
      for(let i=0;i<website_urls.length; i++){
     const url=website_urls[i];

   let getData= await axios(url).then(response=>{ 
        const html=response.data;
        const $ = cheerio.load(html);
       const prices=[];
       //const offer_prices=[];
       const ratings=[];
       let offer_price;
       let price;
       let rating;
        $('.payBlkBig',html).each(function(){
            offer_price=$(this).text();
               // offer_prices.push(offer_price
            //);
           
        });
        $('.pdpCutPrice ',html).each(function(){
          price=$(this).text();
          price= price.replace(/\s\s+/g, ' ');
             // prices.push(price
         // );
         
      });
   
       $('.avrg-rating',html).each(function(){
                 rating=$(this).text();
                 // ratings.push(rating
                //  )
       });
       
       if(price==undefined){
        price="Price unavailable";
        }
        if(offer_price=='Rs.undefined'){
          offer_price="Rating unavailable";
          }
          // if(offer_price.includes("undefined")){
          //     offer_price="Rating unavailable";
          //    }
      if(rating==undefined){
        rating="Rating unavailable";
        }
      snapdeal_product_details.push({"id":i+1,"price":price,"offer_price": "Rs." +offer_price,"rating":rating,"url":url}); 
     // console.log();
}).catch(err=>console.log(err));
}
console.log(snapdeal_product_details);
//console.log(typeof snapdeal_product_details);
       })
//post amazon data into db
app.post("/snpdl_data_post", async function(request,response){
const data=request.body;
console.log(data);
const result_snapdeal=await client
                          .db("Ecommerce_web_scrapping")
                          .collection("snapdeal_products")
                          .insertMany(data);
response.send(result_snapdeal);
                    
});











// //Get Amazon details
//    app.get('/test_data',(request,response)=>{
//     const website_urls=[
//     "https://www.amazon.in/dp/B07PDYW7VS",
//     "https://www.amazon.in/dp/B00W56GLOQ",
//     "https://www.amazon.in/dp/B00935M9H0",
//     "https://www.amazon.in/dp/B06Y6DX2TZ",
//     "https://www.amazon.in/dp/B08DBKH42B",
//     "https://www.amazon.in/dp/B0987TLG66",
//     "https://www.amazon.in/dp/B08QWZCV8R",
//     "https://www.amazon.in/dp/B09DNY91KR",
//     "https://www.amazon.in/dp/B09CSXWNWC",
//     "https://www.amazon.in/dp/B09JSH94QT"
//     ];
    
//     const final_result=[];
//     let amazon_product_details=[];
//     let amazon_product_details1=[];
//                  var amazon_details=[];
//     //    website_urls.forEach(website_urls=>{
//     //function getAmazonDetails(){
//         for(let i=0;i<website_urls.length; i++){
//        const url=website_urls[i];
//      //  console.log(url);
//      const sendGetRequest=async()=>{
//       try{
//      const resp=await axios.get(url); 
//           const html=response.data;
//           const $ = cheerio.load(html);
//          const articles=[];
//          const ratings=[];
//           $('.a-offscreen',html).each(function(){
//               const price=$(this).text();
//             // articles.push({title: title, url: url
//                   articles.push(price
//               );
             
//           });
     
//          $('.a-icon-alt',html).each(function(){
//                    const rating=$(this).text();
//                     ratings.push(rating
//                     );
//          });
//          if(!articles[6].includes("₹")){
//           articles[6]==articles[0];
//          }
//          if(!ratings[0].includes("stars")){
//           ratings[0]="Rating unavailable";
//          }
//          amazon_product_details=({"id":i+1,"price":articles[6],"offer_price": articles[0],"rating":ratings[0],"url":url}); 
//          //console.log(typeof amazon_product_details);
//          //console.log(resp.data);  
//         }catch(err){
//           console.error(err);
//         }
//       }
//         // amazon_product_details=JSON.parse(amazon_product_details1);
        
//    //final_result.push({"price":articles[4],"offer_price": articles[0],"rating":ratings[0],"url":url});
//   // return final_result;
//   //const response=final_result;
//    //res.json(final_result);
//          // amazon_details.push(final_result);
//       console.log(amazon_product_details);   
//   }
  

// //console.log(amazon_product_details);

//          })



  //Get Offer Price
 app.get('/results_test',(req,res)=>{
    const url1="https://www.amazon.in/dp/B09JSH94QT";
    axios(url1).then(response=>{
        const html=response.data;
        const $ = cheerio.load(html);
        const articles1=[];
        $('.a-offscreen',html).each(function(){
          // $('.a-size-medium.a-color-base.a-text-beside-button.a-text-bold .a-offscreen',html).each(function(){
            const price=$(this).text();
            
           // articles.push({title: title, url: url
                articles1.push({price: price
            });
          console.log(articles1)  
        })
    
 res.json(articles1);
}).catch(err=>console.log(err));
}) 

//  //Get Rating
//  app.get('/rating',(req,res)=>{
//     axios(url).then(response=>{
//         const html=response.data;
//         const $ = cheerio.load(html);
//         const ratings=[];
//         $('.a-icon-alt',html).each(function(){
//           // $('.a-size-medium.a-color-base.a-text-beside-button.a-text-bold',html).each(function(){
//             const rating=$(this).text();
//             //const url= $(this).find('a').attr('href');
//            // articles.push({title: title, url: url
//                 ratings.push({rating: rating
//             });
            
//         })
    
//  res.json(ratings[0]);
// }).catch(err=>console.log(err));
// })


//});