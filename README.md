# FedEx Rate Calculator

----
This is a relatively simple tool for getting live rate quotes for FedEx shipments using their Web Services.

This was designed specifically for retail shipping of wine, but the settings allow for a great deal of customization, including:
  - Custom price margin
  - Box specifics like dimensions, weights, and packaging/handling charges
  - States that you are allowed to ship to while conforming to restrictions on shipping aclohol across state lines
  - Days of the week that available for you to ship (ex. closed on Mondays, etc.)


##Installation

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. While this can be run directly from there, it is intended be a standalone desktop application, packaged using [electron-packager](https://www.npmjs.com/package/electron-packager).

----
From your command line:

```bash
# Clone this repository
git clone https://github.com/alexmacy/fedex-rate-calculator
# Go into the repository
cd fedex-rate-calculator
# Install dependencies
npm install
```
----
This can then either be run using 'npm-start':

```bash
# Run the app
npm start
```

Or if running as a standalone desktop application and you already have electron-packager installed:

```bash
# Run electron-packager
electron-packager .
```
----
Once it is installed and running, you need to enter your FedEx Web Services Credentials to be able to communicate with their server:

- Visit [FedEx Developer Resource Center](http://www.fedex.com/us/developer/web-services/index.html) to get the necessary Web Services Credentials - which may require creating a FedEx shipping account.
- Enter your credentials into the fields in Settings -> Credentials within the application.

----

#### License [CC0 1.0 (Public Domain)](LICENSE.md)
