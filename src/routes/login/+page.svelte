<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<form method="POST" action="?/login">
	{#if form?.error}
		<p>Incorrect username or password</p>
	{/if}
	<label>
		Email:
		<input type="email" name="email" required />
	</label><br />
	<label>
		Password:
		<input type="password" name="password" required />
	</label><br />
	<button>Log in</button>
</form>

<a href="/signup">Sign up</a>
