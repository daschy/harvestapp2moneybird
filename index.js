const Harvest = require('harvest');

const config = {
  subdomain: 'miloertola',
  clientId: 'dd51zcspD3paQzgaDnYSOw',
  clientSecret: 'ESnLvBtOrUgdTmV2qcGGGhA-FPPCdHr2EhyBI-9YUSxImBhiLFmkTCen52rhE3QqXTO3pADfBCMLSsrRH05PFg',
  redirectUri: 'http://localhost:3000/',
}

harvest = new Harvest({
  subdomain: config.subdomain,
  redirectUri: config.redirectUri,
  identifier: config.clientId,
  secret: config.clientSecret,
}),
  TimeTracking = harvest.TimeTracking;

TimeTracking.daily({}, function (err, tasks) {
  if (err) throw new Error(err);

  // work with tasks 
});