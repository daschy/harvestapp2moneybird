const Harvest = require('harvest');
const Promise = require('bluebird');

const config = {
  subdomain: 'miloertola',
  clientId: 'dd51zcspD3paQzgaDnYSOw',
  clientSecret: 'ESnLvBtOrUgdTmV2qcGGGhA-FPPCdHr2EhyBI-9YUSxImBhiLFmkTCen52rhE3QqXTO3pADfBCMLSsrRH05PFg',
  redirectUri: 'http://localhost:3000/',
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
}

const harvest = new Harvest({
  // subdomain: config.subdomain,
  // redirectUri: config.redirectUri,
  // identifier: config.clientId,
  // secret: config.clientSecret,
  subdomain: config.subdomain,
  email: config.email,
  password: config.password
});


const { invoices } = harvest;


const invoicesPromise = Promise.promisifyAll(invoices);
invoicesPromise.getAsync(14029006)
  .then(({ body }) => {
    const { invoice } = body;
    console.log(invoice)
  })
  .catch(console.log);

