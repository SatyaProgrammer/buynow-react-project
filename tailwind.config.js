/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: "1rem",

      // default breakpoints but with 40px removed
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1240px",
      },
    },
    extend: {
      colors: {
        primary1: "#453227",
        primary2: "#5f4435",
        primary3: "#795744",
        primary4: "#936a53",
        grey1: "hsl(209, 61%, 16%)",
        grey2: "hsl(211, 39%, 23%)",
        grey3: "hsl(209, 34%, 30%)",
        grey4: "hsl(209, 28%, 39%)",
        grey5: "hsl(210, 22%, 49%)",
        grey6: "hsl(209, 23%, 60%)",
        grey7: "hsl(211, 27%, 70%)",
        grey8: "hsl(210, 31%, 80%)",
        grey9: "hsl(212, 33%, 89%)",
        cldark: "#222",
        cldanger: "hsl(360, 67%, 44%)",
        clgreen: "hsl(125, 67%, 44%)",
        main: "hsl(22, 28%, 29%)",
      },
    },
  },
  plugins: [],
};
