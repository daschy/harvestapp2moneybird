const Harvest = require('harvest');
const { Client } = require('moneybird');
const Promise = require('bluebird');
const prompt = require('prompt');
const _ = require('lodash');
const [, , limitArg = 1000] = process.argv;
const limitArgParsed = parseInt(limitArg, 10);
const limit = Number.isNaN(limitArgParsed) ? 1000 : limitArgParsed;

const config = {
  subdomain: 'miloertola',

  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  moneybird: {
    token: process.env.MONEYBIRD_TOKEN,
    companyId: process.env.MONEYBIRD_COMPANY_ID,
    styleId: process.env.MONEYBIRD_INVOICE_STYLE_ID,
    workflowId: process.env.MONEYBIRD_INVOICE_WORKFLOW_ID,
  }
}

const harvestClient = new Harvest({
  subdomain: config.subdomain,
  email: config.email,
  password: config.password
});
const moneyBirdClient = new Client(config.moneybird.token, config.moneybird.companyId);
const promptGet = Promise.promisify(prompt.get);
const { invoices } = harvestClient;
const invoicesPromise = Promise.promisifyAll(invoices);
let invoiceNumInput = null;
promptGet(['invoice'])
  .then((result) => {
    invoiceNumInput = result.invoice;
    return invoicesPromise.listAsync({})
  })
  .then(({ body: invoices }) => {
    const wantedInvoice = _(invoices).find((invoice) => {
      return invoice.invoices.number === invoiceNumInput
    })
    if (!wantedInvoice) throw `Invoice ${invoiceNumInput} not found in harvest`;
    return wantedInvoice.invoices;
  })
  .then((invoice) => {
    return moneyBirdClient.post('sales_invoices', {
      sales_invoice: {
        contact_id: '203270517602387942',
        document_style_id: config.moneybird.styleId,
        workflow_id: config.moneybird.workflowId,
        invoice_sequence_id: invoice.number,
      }
      // "sales_invoice": {
      //   "reference": "My first invoice",
      //   "contact_id": 181903555240658001,
      //   "details_attributes": { "0": { "description": "Table", "price": "10.5" } }
      // }
    })
  })
  .then((invoice)=>{
    console.log(`invoice ${invoice.id} created`); 
    console.log(invoice);
  })
  // .then((salesInvoices) => {
  //   const wantedInvoice = _(salesInvoices).find((saleInvoice) => {
  //     return saleInvoice.invoice_id === invoiceNumInput;
  //   });
  //   if (wantedInvoice) throw `Invoice ${invoiceNumInput} already found in moneybird`;
  //   return null;
  // })
  .catch(console.log);

