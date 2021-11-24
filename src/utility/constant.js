module.exports = Object.freeze({
  SWAGER_OPTIONS: {
    customCss: `
        .swagger-ui .topbar {
          background-color: #ffffff;
          padding: 10px 0;
        }
        .topbar-wrapper .link:after {
          content: url(${process.env.LOGO_URL});
          width: 240px !important;
          display: flex;
        }
        .topbar-wrapper img[alt="Swagger UI"], .topbar-wrapper span {
        visibility: collapse;
        display: none !important;
        }
      `,
  },
  CORS_OPTIONS: {
    origin: process.env.ORIGIN.split(" "),
    credentials: true,
    optionSuccessStatus: 200,
  },
});
