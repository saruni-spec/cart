require("dotenv").config();
const fs = require("fs");
const pg = require("pg");
const url = require("url");

const config = {
  user: process.env.NEXT_PUBLIC_AIVEN_POSTGRES_USER,
  password: process.env.NEXT_PUBLIC_AIVEN_POSTGRES_PASSWORD,
  host: "pg-6ec544a-smithsaruni16-30e4.c.aivencloud.com",
  port: 23876,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUafgmdenS4CNAFn4cCLHP9nWF3D8wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMGVkZTI4NzAtYTk5Yi00Mzg0LWIwNWItMDkxNWI1ZWRl
OGEzIFByb2plY3QgQ0EwHhcNMjQwODAyMTUyODAxWhcNMzQwNzMxMTUyODAxWjA6
MTgwNgYDVQQDDC8wZWRlMjg3MC1hOTliLTQzODQtYjA1Yi0wOTE1YjVlZGU4YTMg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAI91zsmy
4YYLQkroVZSfbW0gAbYQ4nwjR6KIA5rob/NQO7abwSX0hcjMlorClypn+7UCDdVE
rlIpSnvprFbaueCL1MBP3XGI2WUlvHA4wOpy6X82d+D5L7FfQDVT3XkLCN8yOAxI
nm2B8oOfH6AJ9enzTpcgkVSLLeeEreHm5vvKptPoZ+ywsNsEOJYnFx/RjmQU8/1Q
En277pvR9/l7WxUK9vImkJFGqPHtKrWQzU0AZavj2NxB/+gjIE5JM13e1cu6IGRU
EgjVLLTy2Sb+XFqTH5UeitLwynMNGvPIoFRAEp2Sdvc8nxnKrDDjRko8/7ErTpjU
aCilVDHvcp2POYcUQig7M9CSxEJx90qey7T2xPJCtDb4wC8ihY8rFtqohOKbBC9/
fnVZoNtpSCSvPrsjLBOAmDcLSNANjICfJOAcsnylZ80ebmcIF25b2kNdbkdGYd3G
Dw8RFmmFN7heW+FSf0i0LB+QqoJmRw6+0Xg7Qk1T/+N7dbn+5RhjJugaPQIDAQAB
oz8wPTAdBgNVHQ4EFgQUhGchdl9GGpBlns6riv+uGiFAsUkwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAC5bHZApnA/W593Y
f4ntgp1B9x+N+6SHXnDe+SoC025uihzA4PrkVxNg/GLBtNBpSK0REaEKxf9ffpT0
1HSoWQaBUCWYUpnqgRzIkFOoorMaQmzV3U/XA5kSkJshYHdinqO5Mi0HOoGjV8X/
6HBfXcGC9/ToKaRO6MOSkwdTlDNnyv3EYH9ducsFxy8fdr8m6E4FB9Lo/KFhwumu
8iqfcnRuAMaH4utBJXCeMh2MOUdkZ+CwP4MjJh55OpteksS7/KY0bv4mBcMHpgsT
UT4r63v759JVKVrz9BHuhxS/iELSCwlBsGXdPXaNlkOC+NPeq6Agal2NlAd7JhDf
DoDvSPzPNXr8jOwdw2OzOOLTtnLop7mSMi7ohVBrbyIHa3a+dGvimPFMZGrHADzB
szZ3f62hd6c0hONO82phKtjVvCDOKN+V/bKZACEQttMp4/uZFcR+rKwOWKI/1n0H
K9/babqGfs7I5WKM6Lek95NlvDjMDIcKlCzb77R8ns4mgdGOaw==
-----END CERTIFICATE-----`,
  },
};

const client = new pg.Client(config);
client.connect(function (err) {
  if (err) throw err;
  client.query("SELECT VERSION()", [], function (err, result) {
    if (err) throw err;

    console.log(result.rows[0].version);
    client.end(function (err) {
      if (err) throw err;
    });
  });
});
