export { throttle };
function throttle(func, waitTime) {
    let isQueued = false;
    return () => {
        if (!isQueued) {
            isQueued = true;
            setTimeout(() => {
                isQueued = false;
                func();
            }, waitTime);
        }
    };
}
