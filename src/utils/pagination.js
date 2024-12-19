function pagination(option) {
	if(option.startPage > option.totalPage){
		return;
	}
    var startPage;
    var visiblePages;
	if (option.startPage == option.totalPage) {
		startPage = option.visiblePages + 1;
		visiblePages = option.totalPage;
	}
	else if (option.startPage == option.totalPage - 1) {
		startPage = option.visiblePages;
		visiblePages = option.totalPage;
	}
	else {
		startPage =
			option.startPage > 1 ? option.startPage - 1 : option.startPage;
		visiblePages = option.visiblePages + startPage;
	}
	const paging = document.querySelector(option.page);

	const totalPages = option.totalPage;
	let htmls = "";
	if (startPage != option.startPage || (option.startPage == option.totalPage && option.startPage > 1) ) {
		console.log(option)
		htmls += `<li class="${option.pageIcon} left"><i class="fa-solid fa-chevron-left"></i></li>`;
	}

	for (let i = startPage; i <= totalPages; i++) {
		if (i > visiblePages) {
			break;
		}
		console.log(i);
		htmls +=
			i == option.startPage
				? `<li class ="pageStart">${i}</li>`
				: `<li class="page-item" value="${i}">${i}</li>`;
	}
	if (option.totalPage != option.startPage) {
		htmls += `<li class="${option.pageIcon} right"><i class="fa-solid fa-chevron-right"></i></li>`;
	}

	paging.innerHTML = htmls;
	const pageItems = paging.querySelectorAll('.' + option.pageItem)
	const pageIcons = paging.querySelectorAll('.' + option.pageIcon)

	pageItems.forEach(element => {
		element.addEventListener("click", option.onPageClick.bind(option, element.value));
	});
	pageIcons.forEach(icon => {
		icon.onclick = () => {
			if (icon.classList.contains("right")) {
				console.log("right")
				option.handleNextPage();
			}
			else {
				option.handlePrevPage();
			}
		}
	})

}
export {pagination}