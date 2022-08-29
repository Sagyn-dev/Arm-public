import { Component, OnInit } from '@angular/core';
import {
	ApplicationPaths,
	ChangePasswordActions,
	 QueryParameterNames,
	ReturnUrlType
} from "@app/api-authorization/api-authorization.constants";
import {take} from "rxjs/operators";
import {AuthenticationResultStatus, AuthorizeService} from "@app/api-authorization/authorize.service";
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Environment} from "@angular/compiler-cli/src/ngtsc/typecheck/src/environment";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {
	public message = new BehaviorSubject<string>(null);
	loading: boolean = false;

	constructor(
		private authorizeService: AuthorizeService,
		private activatedRoute: ActivatedRoute,
		private router: Router) { }

	async ngOnInit() {
		const action = this.activatedRoute.snapshot.url[1];
		console.log(action);
		switch (action.path) {
			case ChangePasswordActions.ChangePassword:
				 console.log(ApplicationPaths.Login);
				const redirectUrl = `${window.location.origin}`;
				let changeRoute:string = `${environment.authUrl}/changepassword?redirect_uri=`.concat(redirectUrl).concat("/");
				document.location.href=(changeRoute);


				//window.location.replace(redirectUrl);
				//this.router.navigate(changeRoute,this.getReturnUrl())
				//await this.changePassword(this.getReturnUrl());
				//this.redirectToChangePassword();
				break;
			// case ChangePasswordActions.ChangePasswordCallback:
			// 	await this.processChangePasswordCallback();
			// 	break;
			default:
				throw new Error(`Invalid action '${action}'`);
		}
	}


	private async changePassword(returnUrl: string): Promise<void> {
		this.loading = true;
		const state: INavigationState = { returnUrl };
		const result = await this.authorizeService.signIn(state);
		this.message.next(undefined);
		this.loading = false;
		switch (result.status) {
			case AuthenticationResultStatus.Redirect:
				break;
			case AuthenticationResultStatus.Success:
				await this.navigateToReturnUrl(returnUrl);
				break;
			case AuthenticationResultStatus.Fail:
				await this.router.navigate(ApplicationPaths.LoginFailedPathComponents, {
					queryParams: { [QueryParameterNames.Message]: result.message }
				});
				break;
			default:
				throw new Error(`Invalid status result ${(result as any).status}.`);
		}
	}

	private async processChangePasswordCallback(): Promise<void> {
		const url = window.location.href;
		const result = await this.authorizeService.completeSignIn(url);
		switch (result.status) {
			case AuthenticationResultStatus.Redirect:
				// There should not be any redirects as completeSignIn never redirects.
				throw new Error('Should not redirect.');
			case AuthenticationResultStatus.Success:
				await this.navigateToReturnUrl(this.getReturnUrl(result.state));
				break;
			case AuthenticationResultStatus.Fail:
				this.message.next(result.message);
				break;
		}
	}

	private redirectToChangePassword(): any {
		this.redirectToApChangePasswordPath(
			`${ApplicationPaths.IdentityRegisterPath}?returnUrl=${encodeURI('/' + ApplicationPaths.Login)}`);
	}

	private redirectToProfile(): void {
		this.redirectToApChangePasswordPath(ApplicationPaths.IdentityManagePath);
	}

	private async navigateToReturnUrl(returnUrl: string) {
		// It's important that we do a replace here so that we remove the callback uri with the
		// fragment containing the tokens from the browser history.
		await this.router.navigateByUrl(returnUrl, {
			replaceUrl: true
		});
	}

	private getReturnUrl(state?: INavigationState): string {
		const fromQuery = (this.activatedRoute.snapshot.queryParams as INavigationState).returnUrl;
		// If the url is comming from the query string, check that is either
		// a relative url or an absolute url
		if (fromQuery &&
			!(fromQuery.startsWith(`${window.location.origin}/`) ||
				/\/[^\/].*/.test(fromQuery))) {
			// This is an extra check to prevent open redirects.
			throw new Error('Invalid return url. The return url needs to have the same origin as the current page.');
		}
		return (state && state.returnUrl) ||
			fromQuery ||
			ApplicationPaths.DefaultLoginRedirectPath;
	}

	private redirectToApChangePasswordPath(apiAuthorizationPath: string) {
		// It's important that we do a replace here so that when the user hits the back arrow on the
		// browser they get sent back to where it was on the app instead of to an endpoint on this
		// component.
		console.log(apiAuthorizationPath);
		const redirectUrl = `${window.location.origin}${apiAuthorizationPath}`;
		window.location.replace(redirectUrl);
	}
}

interface INavigationState {
	[ReturnUrlType]: string;
}
