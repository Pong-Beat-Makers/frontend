class Home {
	template() {
		return `
		<div class="home__header">
    <div class="home__header--text">Welcome to Pong!</div>    
</div>
<div class="home__body">
    <ul class="home__body--note note__discriptions">
        <li class="note__item--circle">
            <div></div>
            <div>Rules of Pong</div>
        </li>
        <li class="note__item--number">1. Hit the ball past your opponent.</li>
        <li class="note__item--number">2. Avoid letting the ball pass your own wall.</li>
        <li class="note__item--number">3. Score points to win.</li>
        <li class="note__item--circle">
            <div></div>
            <div>Match types</div>
        </li>
        <li class="note__item--circle note__indent">
            <div></div>
            <div>2 Players (Local)</div>
        </li>
        <li class="note__item--circle note__indent">
            <div></div>
            <div>Random match</div>
        </li>
        <li class="note__item--circle note__indent">
            <div></div>
            <div>Tournament</div>
        </li>
        <li class="note__item--circle">
            <div></div>
            <div>How to play</div>
        </li>
        <li class="note__item--circle">
            <div></div>
            <div>How to chat</div>
        </li>
    </ul>
</div>
<div class="home__footer">
    <div>Team 42tsc_Pong of 42 Seoul</div>
    <div>Contributers: hyeslim, isunwoo, jeelee, naki, youngmch</div>
</div>
		`;
	}
}

export default new Home();