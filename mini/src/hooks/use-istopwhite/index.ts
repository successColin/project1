// import { useIstopwhite } from "@/hooks";
// const { isShowTop, onPageScroll } = useIstopwhite(300);
// onPageScroll();

export default function useIstopwhite(scrollTop: number) {
  const isShowTop = ref(false);
  const pageScrollFun = () => {
    onPageScroll((e) => {
      if (e.scrollTop > scrollTop) {
        isShowTop.value = true;
      }
      else {
        isShowTop.value = false;
      }
    });
  };
  return {
    isShowTop,
    onPageScroll: pageScrollFun,
  };
}
