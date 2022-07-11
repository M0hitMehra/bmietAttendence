const puppeteer = require("puppeteer-extra");
const { Browser } = require("puppeteer-core");
const pdfDoc = require("pdfkit");
const fs = require("fs");
const path = require("path");

let page;
let link = "http://app.bmiet.net/";

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());

// const iPhone = puppeteer.devices['iPhone 6'];
(async function () {
    try {
        const launch = await puppeteer.launch({
            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
            headless: false,
            defaultViewport: null,
            slowMo: 20,
            args: ["--start-maximized "],
        });

        let pagesArr = await launch.pages();
        page = pagesArr[0];

        // await page.emulate(iPhone);


        //abhishek BMIET5005  BMIET5036 BMIET5043
        await page.goto(link);
        let get = await waitAndClick(`.hidden-xs .btn.btn-success`, page);
        await page.waitForSelector(`[type="text"]`);
        await page.type(`[type="text"]`, "BMIET5254");
        await page.type(`[type="password"]`, "134280");
        await page.click(`[type="submit"]`);
        await page.waitForSelector(`.small-box-footer`);
        await page.click(`.small-box-footer`);

        await page.waitForSelector(`[name="dataTable_length"]`);
        await page.click(`[name="dataTable_length"]`);
        await page.waitForSelector('[value="100"]');
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        let name = await getName(".dropdown-toggle");
        const result = await getTotalAtt('[role="row"] td');
        // console.log(result);
       
        // }
        console.log(
            "------------------------------SImple considering lab as only 2 lecture----------------------------------"
        );
        let prsnt = 0;
        let absent = 0;
        for (let i = 0; i < result.length; i++) {
            let dateArr1 = result[i].date.split("-");
            if (result[i].isPresent == "Present" && result[i].noOflec == "2" && dateArr1[0] == '2022' && dateArr1[1] >= 2) {
                prsnt++;
                prsnt++;
            } else if (result[i].isPresent == "Present" && dateArr1[0] == '2022' && dateArr1[1] >= 2) {
                prsnt++;
            } else if (result[i].isPresent == "Absent" && result[i].noOflec == "2" && dateArr1[0] == '2022' && dateArr1[1] >= 2) {
                absent++;
                absent++;
            } else if (dateArr1[0] == '2022' && dateArr1[1] >= 2) {
                absent++;
            }
        }

        let totalAttend = prsnt + absent;
        console.log(`present ${prsnt}`);
        console.log(`absent ${absent}`);
        console.log(`total ${totalAttend}`);
        let percentage = (prsnt / totalAttend) * 100;
        console.log(` ${name} Percentage : ${percentage}%`);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        ///////////////////////////////////////////////////////////////////////////////
        let prsnt1 = 0;
        let absent1 = 0;
        let totalCOUNTER = 0;
        for (let i = 0; i < result.length; i++) {

            let dateArr = result[i].date.split("-");
            // console.log(dateArr);
            // console.log(dateArr.length)
            // console.log(dateArr[1]);
            if (dateArr[0] == '2022' && dateArr[1] >= 2) {
                totalCOUNTER++;
                if (result[i].isPresent == "Present" && dateArr[0] == '2022' && dateArr[1] >= 2) {
                    prsnt1++;
                } else if (result[i].isPresent == "Absent" && dateArr[0] == '2022' && dateArr[1] >= 2) {
                    absent1++;
                }
            }
        }
        console.log(
            "------------------------------SImple considering lab as only 1 lecture----------------------------------"
        );
        let totalAttend1 = prsnt1 + absent1;
        console.log(`present ${prsnt1}`);
        console.log(`absent ${absent1}`);
        console.log(`total ${totalAttend1} `);
        let percentage1 = (prsnt1 / totalAttend1) * 100;
        // let ORpercentage1 = (prsnt1 / totalCOUNTER) * 100;
        console.log(`------------------------->${name} Percentage : ${percentage1}% <---------------------------------`);
        // console.log(` ${name} ORPercentage : ${ORpercentage1}%`);

// pdf......................
            // makepdfAndtxt(result);
     

    } catch (error) {
        console.log(error)
    }
})();


async function waitAndClick(sele, cpage) {
    await cpage.waitForSelector(sele);
    let click = await cpage.click(sele);
    return click;
}

async function getTotalAtt(selec) {
    await page.waitForSelector(selec);
    let list = page.evaluate(rowData, selec);

    return list;
}

function rowData(selec) {
    let rows = document.querySelectorAll(selec);
    
    let rowArr = [];

    for (let i = 0; i < rows.length; i++) {
        let date = rows[i].innerText;
        let isPresent = rows[++i].innerText;
        let lectue = rows[++i].innerText;
        let noOflec = rows[++i].innerText;
        rowArr.push({ date, isPresent, lectue, noOflec });
    }
    return rowArr;
}

async function getName(selec) {
    await page.waitForSelector(selec);
    let list = page.evaluate(nameOfStudent, selec);

    return list;
}

function nameOfStudent(selec) {
    let name = document.querySelector(".dropdown-toggle").innerText;
    return name.trim();
}   

function makepdfAndtxt(result){
    let content = [];
    for (let i = 0; i < result.length; i++) {
        let dateArrq = result[i].date.split("-");
        if(dateArrq[0] == '2022' && dateArrq[1] >= 2){
     content.push({ date : result[i].date, isPresent : result[i].isPresent,lecture : result[i].lectue,noOflecture : result[i].noOflec})
        }
        
    }
    let dir  = path.join(__dirname , "mohit.pdf")
    let dir2  = path.join(__dirname , "mohit.txt")
    // if(fs.existsSync(dir) ==false ){
        fs.appendFileSync(dir2,`\n ==========================${content[0].date} ============================================  \n` +JSON.stringify(content))
      const  pdf = new pdfDoc;
        pdf.pipe(fs.createWriteStream(dir));
        pdf.text( `\n ==========================${content[0].date} ============================  \n` +  JSON.stringify(content));
        pdf.end()
        
}