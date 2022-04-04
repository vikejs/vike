import { defineStore } from "pinia";

export const useCounterStore = defineStore('counter', {
	state: () => {
		return { count: 0 }
	},
	getters: {
		countValue: (state) => state.count
	},
	actions: {
		increment() {
			this.count++
		},
		decrement() {
			this.count--
		}
	}
});
