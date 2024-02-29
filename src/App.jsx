import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const initialList = [
	{
		id: 1,
		value: 'Learning JavaScript',
		completed: false,
	},

	{
		id: 2,
		value: 'Learning React',
		completed: false,
	},

	{
		id: 3,
		value: 'Learning Web',
		completed: false,
	},
];

const sortingMethod = [
	'AllSort',
	'ActiveSort',
	'CompletedSort'
];

function IconButton({ icon, size, onClick, id }) {
	return (
		<>
			<FontAwesomeIcon className='iconButton' icon={icon} size={size} onClick={onClick} id={id} />
		</>
	);
}

function SortingButton({ value, id, onClick, active = false }) {
	let className = 'sortingButton';

	if (active) {
		className += ' active';
	}

	return (
		<>
			<a className={className} id={id} onClick={onClick}>{value}</a>
		</>
	);
}

function TodoItem({ id, children, checked = false, onChange, onDelete }) {
	const [boxChecked, setBoxChecked] = React.useState(checked);
	const handleChange = (e) => {
		setBoxChecked(!boxChecked);
		onChange(e);
	}

	const handleDelete = (e) => {
		onDelete(e, id);
	}

	return (
		<>
			<div className="todoItem">
				<div>
					<input id={id} type="checkbox" checked={boxChecked} onChange={handleChange} /><label className="todoItemLabel">{children}</label>
				</div>
				<IconButton id="DeleteItem" icon={faTrashCan} onClick={handleDelete} />
			</div>
		</>
	);
}

function App() {
	let fullItemList = initialList;

	// Item list that is visible to user
	const [itemList, setItemList] = React.useState(fullItemList);
	const [itemCount, setItemCount] = React.useState(itemList.filter(obj => obj.completed == false).length);
	const [currentSort, setCurrentSort] = React.useState(sortingMethod[0]);

	const sortedList = (fullItemList, sortType) => {
		let newItemList = [];
		switch(sortType) {
			case sortingMethod[0]:
				newItemList = fullItemList;
				setCurrentSort(sortingMethod[0]);
				break;
			case sortingMethod[1]:
				newItemList = Object.values(fullItemList).filter((v) => v.completed == false);
				setCurrentSort(sortingMethod[1]);
				break;
			case sortingMethod[2]:
				newItemList = Object.values(fullItemList).filter((v) => v.completed == true);
				setCurrentSort(sortingMethod[2]);
				break;
			default:
				throw new Error("Sort Type not found");
		}

		return newItemList;
	}

	const addItem = (e) => {
		e.preventDefault();

		let itemInput = document.getElementById('itemInput');
		fullItemList.push({ id: fullItemList[fullItemList.length - 1].id + 1, value: itemInput.value, completed: false });
		setItemList(sortedList(fullItemList, currentSort));

		setItemCount(itemCount + 1);
		itemInput.value = "";
	};

	const deleteItem = (e, id) => {
		let index = 0;

		for(let i = 0; i < fullItemList.length; i++) {
			if(fullItemList[i].id == id) {
				index = i;
			}
		}

		const deletedItem = fullItemList.splice(index, 1);
		
		if(deletedItem[0].completed == false) {
			setItemCount(itemCount - 1);
		}

		setItemList(sortedList(fullItemList, currentSort));
	}

	const handleSort = (e) => {
		e.preventDefault();

		if(e.target.classList.contains('active')) {
			return;
		}

		if (!e.target.classList.contains('active')) {
			document.querySelector('.sortingButton.active').classList.remove('active');
			e.target.classList.add('active');
		}

		let newItemList = sortedList(fullItemList, e.target.id);
		setItemList(newItemList);
	};

	const handleItemCheck = (e) => {
		e.target.checked ? setItemCount(itemCount - 1) : setItemCount(itemCount + 1);
		const itemListCopy = itemList;
		itemListCopy.map((item) => {
			if (item.id == e.target.id) {
				item.completed = !item.completed;
			}
		});
		
		setItemList(sortedList(itemListCopy, currentSort));
	};

	return (
		<>
			<div id="app">
				<div id='app-title'>
					<h1>Things to do</h1>
				</div>
				<div id='app-body'>
					<form id="addItemForm" action="java" onSubmit={addItem}>
						<input type="text" placeholder="Add new" id="itemInput" />
					</form>

					<div id="todoItemsContainer">
						{itemList.map((item) => (
							<TodoItem id={item.id} key={item.id} onChange={handleItemCheck} checked={item.completed} onDelete={deleteItem}>{item.value}</TodoItem>
						))}
					</div>
				</div>
				<div id="app-footer">
					<div id="actionsContainer">
						<IconButton icon={faPlus} size="lg" onClick={() => { document.getElementById('itemInput').focus() }} id="AddItem" />
						<IconButton icon={faMagnifyingGlass} size="lg" id="SearchItem" />
					</div>
					<div id='itemsRemaining'>
						<p>
							{itemCount} items remaining
						</p>
					</div>
					<div id="sortingOptions">
						<SortingButton value="All" id={sortingMethod[0]} onClick={handleSort} active />
						<SortingButton value="Active" id={sortingMethod[1]} onClick={handleSort} />
						<SortingButton value="Completed" id={sortingMethod[2]} onClick={handleSort} />
					</div>
				</div>
			</div>
		</>
	)
}

export default App
