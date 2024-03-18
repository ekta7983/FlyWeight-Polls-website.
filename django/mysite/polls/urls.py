from django.urls import path
from .views import create_poll,get_all_polls, get_polls_by_tags, get_polls_by_id , get_all_tags,increment_option_votes
from . import views
app_name = "polls"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path('get_polls/', get_all_polls, name='get_all_polls'),
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
    path('create_poll/', create_poll, name='create_poll'),
    path('tags/', get_all_tags, name='get_all_tags'),
    path("update/<int:question_id>" , increment_option_votes, name="increment_option_votes"),
    path('get_polls_by_tags/', get_polls_by_tags, name='get_polls_by_tags'),
    path('get_polls_by_id/<int:question_id>', get_polls_by_id, name='get_polls_by_id'),

    # re_path(r'^get_polls_by_tags/(?P<tags>[\w,]+)/$', get_polls_by_tags, name='get_polls_by_tags'),

    # path('get_polls_by_tags/<str:tag>/', get_polls_by_tags, name='get_polls_by_tags'),
]
