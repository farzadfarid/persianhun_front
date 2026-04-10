import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { businessOwnerGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'businesses',
        loadComponent: () =>
          import('./pages/business-list/business-list.page').then(
            (m) => m.BusinessListPage
          ),
      },
      {
        path: 'businesses/:id',
        loadComponent: () =>
          import('./pages/business-detail/business-detail.page').then(
            (m) => m.BusinessDetailPage
          ),
      },
      {
        path: 'my-businesses',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/my-businesses/my-businesses.page').then(
            (m) => m.MyBusinessesPage
          ),
      },
      {
        path: 'create-business',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/create-business/create-business.page').then(
            (m) => m.CreateBusinessPage
          ),
      },
      {
        path: 'edit-business/:id',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/edit-business/edit-business.page').then(
            (m) => m.EditBusinessPage
          ),
      },
      {
        path: 'plans',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/plans-list/plans-list.page').then(
            (m) => m.PlansListPage
          ),
      },
      {
        path: 'activate-subscription',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/activate-subscription/activate-subscription.page').then(
            (m) => m.ActivateSubscriptionPage
          ),
      },
      {
        path: 'payment-callback',
        loadComponent: () =>
          import('./pages/payment-callback/payment-callback.page').then(
            (m) => m.PaymentCallbackPage
          ),
      },
      {
        path: 'favorites',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/favorites/favorites.page').then(
            (m) => m.FavoritesPage
          ),
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/notifications/notifications.page').then(
            (m) => m.NotificationsPage
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/user-profile/user-profile.page').then(
            (m) => m.UserProfilePage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then(
            (m) => m.SettingsPage
          ),
      },
      // Public browsing
      {
        path: 'events',
        loadComponent: () =>
          import('./pages/events/events.page').then((m) => m.EventsPage),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./pages/event-details/event-details.page').then((m) => m.EventDetailsPage),
      },
      {
        path: 'offers',
        loadComponent: () =>
          import('./pages/offers/offers.page').then((m) => m.OffersPage),
      },
      {
        path: 'offers/:id',
        loadComponent: () =>
          import('./pages/offer-details/offer-details.page').then((m) => m.OfferDetailsPage),
      },
      {
        path: 'deals',
        loadComponent: () =>
          import('./pages/deals/deals.page').then((m) => m.DealsPage),
      },
      {
        path: 'deals/:id',
        loadComponent: () =>
          import('./pages/deal-details/deal-details.page').then((m) => m.DealDetailsPage),
      },
      // Auth-required user pages
      {
        path: 'add-review/:businessId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/add-review/add-review.page').then((m) => m.AddReviewPage),
      },
      {
        path: 'my-reviews',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/my-reviews/my-reviews.page').then((m) => m.MyReviewsPage),
      },
      {
        path: 'my-business-reviews',
        redirectTo: 'my-reviews',
        pathMatch: 'full',
      },
      {
        path: 'suggest-business',
        loadComponent: () =>
          import('./pages/suggest-business/suggest-business.page').then((m) => m.SuggestBusinessPage),
      },
      {
        path: 'report',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/report/report.page').then((m) => m.ReportPage),
      },
      // BusinessOwner aggregate management pages
      {
        path: 'my-deals',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/my-deals/my-deals.page').then((m) => m.MyDealsPage),
      },
      {
        path: 'create-deal',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/create-deal/create-deal.page').then((m) => m.CreateDealPage),
      },
      {
        path: 'edit-deal/:id',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/edit-deal/edit-deal.page').then((m) => m.EditDealPage),
      },
      {
        path: 'my-offers',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/my-offers/my-offers.page').then((m) => m.MyOffersPage),
      },
      {
        path: 'create-offer',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/create-offer/create-offer.page').then((m) => m.CreateOfferPage),
      },
      {
        path: 'edit-offer/:id',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/edit-offer/edit-offer.page').then((m) => m.EditOfferPage),
      },
      {
        path: 'my-events',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/my-events/my-events.page').then((m) => m.MyEventsPage),
      },
      {
        path: 'create-event',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/create-event/create-event.page').then((m) => m.CreateEventPage),
      },
      {
        path: 'edit-event/:id',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/edit-event/edit-event.page').then((m) => m.EditEventPage),
      },
      {
        path: 'my-contact-requests',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/my-contact-requests/my-contact-requests.page').then((m) => m.MyContactRequestsPage),
      },
      // BusinessOwner management pages
      {
        path: 'business-offers/:businessId',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/business-offers/business-offers.page').then((m) => m.BusinessOffersPage),
      },
      {
        path: 'business-events/:businessId',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/business-events/business-events.page').then((m) => m.BusinessEventsPage),
      },
      {
        path: 'business-leads/:businessId',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/business-leads/business-leads.page').then((m) => m.BusinessLeadsPage),
      },
      {
        path: 'business-followers/:businessId',
        canActivate: [businessOwnerGuard],
        loadComponent: () =>
          import('./pages/business-followers/business-followers.page').then((m) => m.BusinessFollowersPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
