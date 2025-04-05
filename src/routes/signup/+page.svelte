<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<form method="POST" action="?/signup">
	{#if form?.error}
		<p>Incorrect username or password</p>
	{/if}
	<label>
		Username:
		<input type="username" name="username" required />
	</label><br />
	<label>
		Email:
		<input type="email" name="email" required />
	</label><br />
	<label>
		Password:
		<input type="password" name="password" required />
	</label><br />
	<button>Sign up</button>
</form>
