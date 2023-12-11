export default class Errors {
	errors = new Set<string>();

	get isEmpty() {
		return this.errors.size === 0;
	};

	set(key: string, field: HTMLInputElement, label: HTMLParagraphElement, labelText: string) {
		this.errors.add(key);
		field.classList.add('input-error');
		label.classList.remove('hidden');
		label.innerHTML = labelText;
	};

	unset(key: string, field: HTMLInputElement, label: HTMLParagraphElement) {
		this.errors.delete(key);
		field.classList.remove('input-error');
		label.classList.add('hidden');
		label.innerHTML = '';
	};
};