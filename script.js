document.addEventListener("DOMContentLoaded", function () {
	const currentYear = new Date().getFullYear();

	["year", "currentYear"].forEach(function (id) {
		const element = document.getElementById(id);

		if (element) {
			element.textContent = currentYear;
		}
	});

	const currentPage =
		window.location.pathname.split("/").pop() || "index.html";

	const navbar = document.getElementById("navbarLibrary");
	const navLinks = document.querySelectorAll(
		".navbar .nav-link"
	);

	navLinks.forEach(function (link) {
		const linkPage = link.getAttribute("href");

		link.classList.remove("active");
		link.removeAttribute("aria-current");

		if (linkPage === currentPage) {
			link.classList.add("active");
			link.setAttribute("aria-current", "page");
		}
		link.addEventListener("click", function () {
			if (
				navbar &&
				navbar.classList.contains("show") &&
				window.bootstrap
			) {
				window.bootstrap.Collapse
					.getOrCreateInstance(navbar)
					.hide();
			}
		});
	});

	const statNumbers = document.querySelectorAll(
		".stat-item h3[data-count]"
	);

	function animateCounter(element) {
		if (element.dataset.animated === "true") return;

		element.dataset.animated = "true";

		const target = Number(element.dataset.count);

		if (!Number.isFinite(target)) return;

		const duration = 1200;
		const startTime = performance.now();

		function updateCounter(currentTime) {
			const progress = Math.min(
				(currentTime - startTime) / duration,
				1
			);

			const easedProgress =
				1 - Math.pow(1 - progress, 3);

			const currentValue = Math.floor(
				target * easedProgress
			);

			element.textContent =
				currentValue.toLocaleString("id-ID") + "+";

			if (progress < 1) {
				requestAnimationFrame(updateCounter);
			} else {
				element.textContent =
					target.toLocaleString("id-ID") + "+";
			}
		}

		requestAnimationFrame(updateCounter);
	}

	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			function (entries, currentObserver) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						animateCounter(entry.target);
						currentObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.4 }
		);

		statNumbers.forEach(function (element) {
			observer.observe(element);
		});
	} else {
		statNumbers.forEach(animateCounter);
	}

	const bookGrid = document.getElementById("bookGrid");
	const bookSearch = document.getElementById("bookSearch");
	const categoryFilter =
		document.getElementById("categoryFilter");
	const catalogResult =
		document.getElementById("catalogResult");
	const catalogEmpty =
		document.getElementById("catalogEmpty");
	if (
		bookGrid &&
		bookSearch &&
		categoryFilter &&
		catalogResult &&
		catalogEmpty
	) {
		const books = [
			{
				title: "Laut Bercerita",
				author: "Leila S. Chudori",
				category: "fiksi",
				cover:
					"https://covers.openlibrary.org/b/isbn/9786024246945-L.jpg",
				available: true
			},
			{
				title: "Atomic Habits",
				author: "James Clear",
				category: "pendidikan",
				cover:
					"https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
				available: true
			},
			{
				title: "Rich Dad Poor Dad",
				author: "Robert T. Kiyosaki",
				category: "bisnis",
				cover:
					"https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
				available: false
			},
			{
				title: "The Psychology of Money",
				author: "Morgan Housel",
				category: "bisnis",
				cover:
					"https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
				available: true
			}
		];

		function createBookCard(book) {
			const article = document.createElement("article");
			article.className = "book-card";

			const cover = document.createElement("div");
			cover.className = "book-cover";

			const image = document.createElement("img");
			image.src = book.cover;
			image.alt = "Sampul buku " + book.title;
			image.loading = "lazy";

			const fallback = document.createElement("div");
			fallback.className = "book-cover-fallback";
			fallback.textContent = book.title;
			fallback.hidden = true;

			image.addEventListener("error", function () {
				image.hidden = true;
				fallback.hidden = false;
			});

			cover.append(image, fallback);

			const details = document.createElement("div");
			details.className = "book-details";

			const category = document.createElement("span");
			category.className = "book-category";
			category.textContent = book.category;

			const title = document.createElement("h3");
			title.textContent = book.title;

			const author = document.createElement("p");
			author.className = "book-author";
			author.textContent = book.author;

			const status = document.createElement("span");
			status.className = book.available
				? "book-status"
				: "book-status unavailable";

			status.textContent = book.available
				? "Tersedia"
				: "Sedang dipinjam";

			details.append(category, title, author, status);
			article.append(cover, details);

			return article;
		}

		function renderBooks() {
			const keyword = bookSearch.value
				.trim()
				.toLowerCase();

			const selectedCategory = categoryFilter.value;

			const filteredBooks = books.filter(function (book) {
				const matchesKeyword =
					book.title.toLowerCase().includes(keyword) ||
					book.author.toLowerCase().includes(keyword);

				const matchesCategory =
					selectedCategory === "semua" ||
					book.category === selectedCategory;

				return matchesKeyword && matchesCategory;
			});

			bookGrid.replaceChildren();

			filteredBooks.forEach(function (book) {
				bookGrid.appendChild(createBookCard(book));
			});

			catalogResult.textContent =
				`Menampilkan ${filteredBooks.length} dari ${books.length} buku.`;

			catalogEmpty.hidden = filteredBooks.length !== 0;
			bookGrid.hidden = filteredBooks.length === 0;
		}

		bookSearch.addEventListener("input", renderBooks);
		categoryFilter.addEventListener("change", renderBooks);

		renderBooks();
	}

	const pageType = document.body.dataset.page;

	const searchInput = document.getElementById("searchMember");
	const filterType = document.getElementById("filterType");
	const tableBody = document.getElementById("membersTableBody");
	const emptyMessage = document.getElementById("emptyMembers");
	const memberCount = document.getElementById("memberCount");

	if (
		searchInput &&
		filterType &&
		tableBody &&
		emptyMessage &&
		memberCount
	) {
		const sampleMembers = [
			{ nama: "Aditya Pratama", nim: "5025231001", prodi: "Informatika", jenis: "Mahasiswa", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Nadia Putri Lestari", nim: "5025231015", prodi: "Sistem Informasi", jenis: "Mahasiswa", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Rizky Ramadhan", nim: "5025231028", prodi: "Teknik Komputer", jenis: "Mahasiswa", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Maya Kusuma", nim: "198705122014", prodi: "Informatika", jenis: "Dosen", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Farhan Alamsyah", nim: "5025231042", prodi: "Teknologi Informasi", jenis: "Mahasiswa", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Siti Rahmawati", nim: "198902152016", prodi: "Administrasi Akademik", jenis: "Tenaga Kependidikan", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Dimas Arya Saputra", nim: "5025231060", prodi: "Sistem Informasi", jenis: "Mahasiswa", alamat: "-", telepon: "-", email: "-" },
			{ nama: "Budi Santoso", nim: "197811202010", prodi: "Ilmu Perpustakaan", jenis: "Dosen", alamat: "-", telepon: "-", email: "-" }
		];

		function getMembers() {
			try {
				const savedData = localStorage.getItem("libraryMembers");

				if (savedData === null) {
					if (pageType === "admin") {
						localStorage.setItem("libraryMembers", JSON.stringify(sampleMembers));
						return sampleMembers;
					}

					return sampleMembers;
				}

				const members = JSON.parse(savedData);
				return Array.isArray(members) ? members : [];
			} catch (error) {
				console.error("Gagal membaca data anggota:", error);
				return [];
			}
		}

		function saveMembers(members) {
			localStorage.setItem("libraryMembers", JSON.stringify(members));
		}

		function getMemberName(member) {
			return member.nama || member.name || "-";
		}

		function getMemberNumber(member) {
			return member.nim || member.nrp || member.nip || member.nimNrp || "-";
		}

		function getMemberProgram(member) {
			return member.prodi || member.programStudi || member.unit || "-";
		}

		function getMemberType(member) {
			return member.jenis || member.jenisKeanggotaan || member.tipe || "-";
		}

		function prepareMembers() {
			const members = getMembers();

			let changed = false;

			members.forEach(function (member, index) {
				if (!member._adminKey) {
					member._adminKey = "member-" + Date.now() + "-" + index;
					changed = true;
				}
			});

			if (changed) {
				saveMembers(members);
			}

			return members;
		}

		function appendCell(row, value, className = "") {
			const cell = document.createElement("td");
			cell.textContent = value || "-";

			if (className) {
				cell.className = className;
			}

			row.appendChild(cell);
			return cell;
		}

		function createActionButton(label, className, action, key) {
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = label;
			button.className = className;
			button.dataset.memberAction = action;
			button.dataset.memberKey = key;
			return button;
		}

		function showModal(modalId) {
			const modal = document.getElementById(modalId);

			if (modal) {
				modal.hidden = false;
				document.body.classList.add("modal-open");
			}
		}

		function hideModal(modalId) {
			const modal = document.getElementById(modalId);

			if (modal) {
				modal.hidden = true;
			}

			if (!document.querySelector(".admin-modal:not([hidden])")) {
				document.body.classList.remove("modal-open");
			}
		}

		function findMember(key) {
			return prepareMembers().find(function (member) {
				return String(member._adminKey) === String(key);
			});
		}

		function addDetail(container, label, value) {
			const item = document.createElement("div");
			item.className = "detail-item";

			const heading = document.createElement("span");
			heading.textContent = label;

			const content = document.createElement("strong");
			content.textContent = value || "-";

			item.append(heading, content);
			container.appendChild(item);
		}

		function openMemberDetails(member) {
			const details = document.getElementById("memberDetails");
			if (!details) return;

			details.replaceChildren();

			addDetail(details, "Nama Lengkap", getMemberName(member));
			addDetail(details, "NIM / NRP / NIP", getMemberNumber(member));
			addDetail(details, "Program Studi / Unit", getMemberProgram(member));
			addDetail(details, "Jenis Keanggotaan", getMemberType(member));
			addDetail(details, "Alamat", member.alamat || member.address || "-");
			addDetail(details, "Nomor Telepon", member.telepon || member.phone || "-");
			addDetail(details, "Email", member.email || "-");

			showModal("viewModal");
		}

		function openEditForm(member) {
			document.getElementById("editMemberKey").value = member._adminKey;
			document.getElementById("editNama").value = getMemberName(member) === "-" ? "" : getMemberName(member);
			document.getElementById("editNim").value = getMemberNumber(member) === "-" ? "" : getMemberNumber(member);
			document.getElementById("editProdi").value = getMemberProgram(member) === "-" ? "" : getMemberProgram(member);
			document.getElementById("editAlamat").value = member.alamat || member.address || "";
			document.getElementById("editTelepon").value = member.telepon || member.phone || "";
			document.getElementById("editEmail").value = member.email || "";
			document.getElementById("editJenis").value = getMemberType(member);

			showModal("editModal");
		}

		function renderMembers() {
			const allMembers = prepareMembers();
			const keyword = searchInput.value.trim().toLowerCase();
			const selectedType = filterType.value;

			const filteredMembers = allMembers.filter(function (member) {
				const name = getMemberName(member).toLowerCase();
				const number = getMemberNumber(member).toLowerCase();
				const type = getMemberType(member);

				return (
					(name.includes(keyword) || number.includes(keyword)) &&
					(!selectedType || type === selectedType)
				);
			});

			tableBody.replaceChildren();

			filteredMembers.forEach(function (member, index) {
				const row = document.createElement("tr");
				const key = member._adminKey;

				appendCell(row, String(index + 1));
				appendCell(row, getMemberName(member), "member-name");
				appendCell(row, getMemberNumber(member), "member-number");
				appendCell(row, getMemberProgram(member));

				const typeCell = document.createElement("td");
				const badge = document.createElement("span");
				badge.className = "member-type";
				badge.textContent = getMemberType(member);
				typeCell.appendChild(badge);
				row.appendChild(typeCell);

				if (pageType === "admin") {
					const actionCell = document.createElement("td");
					actionCell.className = "admin-actions";
					actionCell.append(
						createActionButton("Lihat", "action-view", "view", key),
						createActionButton("Edit", "action-edit", "edit", key),
						createActionButton("Hapus", "action-delete", "delete", key)
					);
					row.appendChild(actionCell);
				}

				tableBody.appendChild(row);
			});

			emptyMessage.hidden = filteredMembers.length > 0;

			const table = tableBody.closest("table");
			const tableHead = table ? table.querySelector("thead") : null;

			if (tableHead) {
				tableHead.hidden = filteredMembers.length === 0;
			}

			if (pageType === "admin") {
				memberCount.textContent = allMembers.length + " anggota";
			} else {
				memberCount.textContent =
					"Menampilkan " + filteredMembers.length +
					" dari " + allMembers.length + " anggota";
			}
		}

		if (pageType === "admin") {
			prepareMembers();

			tableBody.addEventListener("click", function (event) {
				const button = event.target.closest("[data-member-action]");
				if (!button) return;

				const action = button.dataset.memberAction;
				const key = button.dataset.memberKey;
				const member = findMember(key);

				if (!member) {
					alert("Data anggota tidak ditemukan.");
					renderMembers();
					return;
				}

				if (action === "view") {
					openMemberDetails(member);
				}

				if (action === "edit") {
					openEditForm(member);
				}

				if (action === "delete") {
					const confirmed = window.confirm(
						'Yakin ingin menghapus data anggota "' +
						getMemberName(member) + '"?'
					);

					if (!confirmed) return;

					const updatedMembers = prepareMembers().filter(function (item) {
						return String(item._adminKey) !== String(key);
					});

					saveMembers(updatedMembers);
					renderMembers();
					alert("Data anggota berhasil dihapus.");
				}
			});

			const editForm = document.getElementById("editMemberForm");

			if (editForm) {
				editForm.addEventListener("submit", function (event) {
					event.preventDefault();

					const key = document.getElementById("editMemberKey").value;
					const members = prepareMembers();
					const index = members.findIndex(function (member) {
						return String(member._adminKey) === String(key);
					});

					if (index === -1) {
						alert("Data anggota tidak ditemukan.");
						return;
					}

					const updatedMember = {
						...members[index],
						nama: document.getElementById("editNama").value.trim(),
						nim: document.getElementById("editNim").value.trim(),
						prodi: document.getElementById("editProdi").value.trim(),
						alamat: document.getElementById("editAlamat").value.trim(),
						telepon: document.getElementById("editTelepon").value.trim(),
						email: document.getElementById("editEmail").value.trim(),
						jenis: document.getElementById("editJenis").value
					};

					if (!updatedMember.nama || !updatedMember.nim || !updatedMember.prodi) {
						alert("Nama, nomor identitas, dan program studi wajib diisi.");
						return;
					}

					members[index] = updatedMember;
					saveMembers(members);
					hideModal("editModal");
					renderMembers();
					alert("Perubahan data anggota berhasil disimpan.");
				});
			}

			document.querySelectorAll("[data-close-modal]").forEach(function (button) {
				button.addEventListener("click", function () {
					hideModal(button.dataset.closeModal);
				});
			});

			document.querySelectorAll(".admin-modal").forEach(function (modal) {
				modal.addEventListener("click", function (event) {
					if (event.target === modal) {
						hideModal(modal.id);
					}
				});
			});

			document.addEventListener("keydown", function (event) {
				if (event.key === "Escape") {
					document.querySelectorAll(".admin-modal:not([hidden])").forEach(function (modal) {
						hideModal(modal.id);
					});
				}
			});
		}

		searchInput.addEventListener("input", renderMembers);
		filterType.addEventListener("change", renderMembers);

		window.addEventListener("storage", function (event) {
			if (event.key === "libraryMembers") {
				renderMembers();
			}
		});

		renderMembers();
	}

	const loginForm = document.getElementById("loginForm");

	if (loginForm) {
		loginForm.addEventListener("submit", function (event) {
			event.preventDefault();

			const email = document.getElementById("loginEmail").value.trim();
			const password = document.getElementById("loginPassword").value;
			const loginMessage = document.getElementById("loginMessage");

			if (
				email === "petugas@libraryreg.id" &&
				password === "library123"
			) {
				localStorage.setItem("isLoggedIn", "true");
				window.location.href = "admin.html";
			} else if (loginMessage) {
				loginMessage.textContent = "Email atau password salah.";
			}
		});
	}

	const logoutButton = document.getElementById("logoutButton");

	if (logoutButton) {
		logoutButton.addEventListener("click", function () {
			localStorage.removeItem("isLoggedIn");
			window.location.href = "login.html";
		});
	}

	if (pageType === "admin" && localStorage.getItem("isLoggedIn") !== "true") {
		window.location.replace("login.html");
	}
});
