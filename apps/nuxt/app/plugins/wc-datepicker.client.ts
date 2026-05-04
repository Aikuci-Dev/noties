import { WcDatepicker } from "wc-datepicker/dist/components/wc-datepicker";

export default defineNuxtPlugin(() => {
  customElements.define("wc-datepicker", WcDatepicker);
});
