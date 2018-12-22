const app = new Vue({
	el: '#app',
	data: {
		characters: [],
		shows: [],
		characterFilter: '',
		showFilter: '',
		characterSelections: JSON.parse(charactersJSON) || {},
		showSelections: JSON.parse(showsJSON) || {},
		showAllCharacters: false,
		showAllShows: false,
		saveButtonText: 'Save Selections',
		changesSinceSave: false
	},
	template: `
		<div class="app">
			<section class="section" id="shows">
				<div class="container">
					<div class="level">
						<div class="level-left">
							<div class="intro">
								<h2 class="is-size-2 is-size-3-mobile">Shows</h2>
							</div>
						</div>
						<div class="level-right">
							<div class="field is-grouped">
								<p class="control">
									<button :class="{button: true, 'is-link': showAllShows}" @click="showAllShows = !showAllShows">Show{{showAllShows ? 'ing' : ''}} All</button>
								</p>
								<p class="control is-expanded">
									<input class="input" type="text" placeholder="Find a show..." v-model="showFilter">
								</p>
							</div>
						</div>
					</div>
					<show-list
						:shows="shows"
						:options="[
							'Action',
							'Adventure',
							'Comedy',
							'Drama',
							'Romance',
							'Slice of Life',
							'Thriller/Mystery'
						]"
						:filterText="showFilter"
						:showAll="showAllShows"
						v-model="showSelections"
					/>
				</div>
			</section>
			<section class="section" id="characters">
				<div class="container">
					<div class="level">
						<div class="level-left">
							<div class="intro">
								<h2 class="is-size-2 is-size-3-mobile">Characters</h2>
							</div>
						</div>
						<div class="level-right">
							<div class="field is-grouped">
								<p class="control">
									<button :class="{button: true, 'is-link': showAllCharacters}" @click="showAllCharacters = !showAllCharacters">Show{{showAllCharacters ? 'ing' : ''}} All</button>
								</p>
								<p class="control is-expanded">
									<input class="input" type="text" placeholder="Find a character..." v-model="characterFilter">
								</p>
							</div>
						</div>
					</div>
					<character-list
						:characters="characters"
						:filterText="characterFilter"
						:options="[
							'Main Dramatic',
							'Main Comedic',
							'Supporting Dramatic',
							'Supporting Comedic'
						]"
						v-model="characterSelections"
						:showAll="showAllCharacters"
					/>
				</div>
			</section>
			<div class="save-footer">
				<button class="button is-success save-button" @click="save">{{saveButtonText}}</button>
			</div>
		</div>
	`,
	watch: {
		showSelections: {
			handler () {
				this.changesSinceSave = true
			},
			deep: true
		},
		characterSelections: {
			handler () {
				this.changesSinceSave = true
			},
			deep: true
		}
	},
	methods: {
		save () {
			this.saveButtonText = "Saving..."
			submit('/response/public_nominations', {
				characters: this.characterSelections,
				shows: this.showSelections
			}).then(() => {
				this.changesSinceSave = false;
				this.saveButtonText = "Saved!"
				setTimeout(() => {
					this.saveButtonText = "Save Selections"
				}, 1500)
			}).catch(() => {
				this.saveButtonText = "Save Selections"
				alert('Failed to save, try again')
			});
		}
	}
});

window.onbeforeunload = function () {
	if (app.changesSinceSave) return "You have unsaved selections. Leave without saving?"
}

fetch('/data/test.json').then(res => {
	console.log(res);
	return res.json();
}).then(({characters, shows}) => {
	console.log(characters, shows);
	app.characters = characters.sort((a, b) => a.terms[0].replace(/^\s*|\s*$/g, '').localeCompare(b.terms[0].replace(/^\s*|\s*$/g, '')));
	app.shows = shows.sort((a, b) => a.terms[0].replace(/^\s*|\s*$/g, '').localeCompare(b.terms[0].replace(/^\s*|\s*$/g, '')));
});
