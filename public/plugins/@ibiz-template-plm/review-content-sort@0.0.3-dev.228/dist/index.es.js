import { FetchMethod as c, registerDEMethodProvider as d } from "@ibiz-template/runtime";
class l extends c {
  async exec(e, t, r, s) {
    const o = await super.exec(e, t, r, s);
    return o.data.sort(
      (n, i) => n.test_case && i.test_case ? n.test_case.identifier.localeCompare(i.test_case.identifier) : -1
    ), o;
  }
}
class u {
  create(e, t, r, s) {
    return new l(e, t, r, s.localMode);
  }
}
function _() {
  d(
    "DEMETHOD_REVIEW_CONTENT_SORT",
    () => new u()
  );
}
const E = {
  install() {
    _();
  }
};
export {
  E as default,
  _ as registerReviewContentSortProvider
};
