import { registerDEMethodProvider as i, FetchMethod as d } from "@ibiz-template/runtime";
class l extends d {
  async exec(e, t, s, r) {
    const a = await super.exec(e, t, s, r);
    return a.data.sort((c, n) => c.test_case && n.test_case ? c.test_case.identifier.localeCompare(n.test_case.identifier) : -1), a;
  }
}
class _ {
  create(e, t, s, r) {
    return new l(e, t, s, r.localMode);
  }
}
function E() {
  i(
    "DEMETHOD_REVIEW_CONTENT_SORT",
    () => new _()
  );
}
const f = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install() {
    E();
  }
};
export {
  f as default,
  E as registerReviewContentSortProvider
};
