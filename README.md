# good-ipo CLI Tool Readme

The `good-ipo` package is a command-line interface (CLI) tool designed to provide you with an easy and convenient way to access information about current and upcoming Initial Public Offerings (IPOs). This tool fetches IPO data and presents it in a tabular format, displaying essential details such as the IPO name, price, GMP (Grey Market Premium), listing price, opening date, and closing date. To enhance visibility, the CLI tool also marks current IPOs with a red background color if their closing date is today or tomorrow.

Whether you're an investor, trader, or simply interested in keeping track of IPOs, `good-ipo` offers a straightforward way to stay informed about the latest offerings and make informed decisions.

## Installation

To install the `good-ipo` CLI tool, you need to have Node.js and npm (Node Package Manager) installed on your system. If you haven't installed them yet, you can download them from the official Node.js website: https://nodejs.org/

Once you have Node.js and npm installed, follow these steps to install `good-ipo`:

1. Open your terminal or command prompt.

2. Run the following npm command to install `good-ipo` globally on your system:

```bash
npm install -g good-ipo
```

3. Once the installation is complete, you can start using the `good-ipo` CLI tool right from your command line.

## Usage

Using the `good-ipo` CLI tool is simple. Open your terminal or command prompt and run the following command:

```bash
good-ipo
```

This will fetch the latest IPO data and display it in a tabular format, highlighting current IPOs with a red background color if their closing date is today or tomorrow.

## Example

Here's an example of how the `good-ipo` CLI tool displays IPO data:

```
Data is fetched from https://www.topsharebrokers.com/report/live-ipo-gmp/331/?ref=chr
╔═══════════════════════════════════════════════╤═══════╤═════╤══════════════╤════════╤════════╗
║ NAME                                          │ PRICE │ GMP │ LISTING      │ OPEN   │ CLOSE  ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ TVS Supply Chain IPOClosing Today (Sub:2.85x) │ 197   │ 3   │ 200 (1.52%)  │ 10-Aug │ 14-Aug ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Shelter Pharma SMEClosing Today (Sub:15.25x)  │ 42    │ 1   │ 43 (2.38%)   │ 10-Aug │ 14-Aug ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Balaji Speciality Chemicals IPOUpcoming       │ NA    │ 55  │ --           │        │        ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Shoora Designs SMEUpcoming                    │ 48    │ --  │ 48 (0.00%)   │ 17-Aug │ 21-Aug ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Pyramid Technoplast IPOUpcoming               │ 166   │ 19  │ 185 (11.45%) │ 18-Aug │ 22-Aug ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Crop Life Science SMEUpcoming                 │ 52    │ 3   │ 55 (5.77%)   │ 18-Aug │ 22-Aug ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Bondada Engineering SMEUpcoming               │ 75    │ 10  │ 85 (13.33%)  │ 18-Aug │ 22-Aug ║
╟───────────────────────────────────────────────┼───────┼─────┼──────────────┼────────┼────────╢
║ Aeroflex Industries IPOUpcoming               │ 108   │ 40  │ 148 (37.04%) │ 22-Aug │ 24-Aug ║
╚═══════════════════════════════════════════════╧═══════╧═════╧══════════════╧════════╧════════╝
```

In this example, the first IPO ("ABC Ltd") has a red background color because its closing date is tomorrow.

## Development
We also export a default function that you can import to get a JSON. The JSON format is 
```
[
    {
        name: 'ABC IPOUpcoming',
        type: 'IPO',
        link: '/gmp/jyoti-cnc-automation-ipo-gmp/734/',
        price: '331',
        gmp: '77',
        listing: '408 (23.26%)',
        open: '9-Jan',
        close: '11-Jan',
        rii: '',
        nii: '',
        qib: '',
        others: '',
        total: ''
    }
]
```
_type:_ Possible values are IPO | SME

## Contributing

If you would like to contribute to the `good-ipo` package or report any issues, please visit the GitHub repository: [https://github.com/anmol5varma/good-ipo](https://github.com/anmol5varma/good-ipo)

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/anmol5varma/good-ipo/blob/main/LICENSE) file for details.

---

Thank you for using the `good-ipo` CLI tool! We hope it helps you stay up-to-date with the latest IPOs and make informed investment decisions. If you have any questions or feedback, please don't hesitate to reach out to us.
