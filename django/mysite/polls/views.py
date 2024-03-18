from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from .models import Question, Choice,Tag
from django.utils import timezone
from django.urls import reverse
from django.views import generic
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
# from django.middleware.csrf import get_token
import json,requests
# from django.template import loader


@csrf_exempt
def create_poll(request):
    if request.method == 'POST':
        try:
            # Parse the JSON payload from the request
            data = json.loads(request.body)
            
            # Extract relevant information
            question_text = data.get('Question', '')
            options = data.get('OptionVote', {})
            tags = data.get('Tags', [])
            
            # Print the extracted information for debugging
            print(f"Question: {question_text}")
            print(f"Options: {options}")
            print(f"Tags: {tags}")
            # Create a new Question instance
            new_question = Question(question_text=question_text , pub_date=timezone.now())
            new_question.save()

            # Create Choice instances for each option
            for option_text, votes in options.items():
                choice = Choice(question=new_question, choice_text=option_text, votes=int(votes))
                choice.save()

            # Perform any additional processing as needed, such as adding tags
                # Create and associate tags with the question
            for tag_name in tags:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                new_question.tags.add(tag)

            # Return a success response
            return JsonResponse({'status': 'success', 'message': 'Poll created successfully'})
        except json.JSONDecodeError as e:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON payload'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
    
# @csrf_exempt
def get_all_polls(request):
    if request.method == 'GET':
    # Retrieve all questions from the database
        print(request)
        all_questions = Question.objects.all()

    # Prepare the data in the specified JSON format
        polls_data = []
        for question in all_questions:
            options_data = {}
            for choice in question.choice_set.all():
                options_data[choice.choice_text] = choice.votes

            poll_data = {
                 "id": question.id,
                "Question": question.question_text,
                "OptionVote": options_data,
                "Tags": [tag.name for tag in question.tags.all()] if question.tags.exists() else []
                # "Tags": question.tags.split(",") if question.tags else []  # Assuming tags are stored as a comma-separated string
            }
            polls_data.append(poll_data)

    # Return the data as JSON response
        return JsonResponse(polls_data, safe=False)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

#filter data by tags
@require_GET
def get_polls_by_tags(request):
        tags = request.GET.get('tags', None)
        print(tags)
        if tags is not None:
        # Convert tags to a list if they are passed as separate arguments
          tags_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
        # Rest of the code...
        else:
          return JsonResponse({'status': 'error', 'message': 'Please enter the tag to filter'},status=400) 
        if request.method == 'GET':
            # Convert tags to a list if they are passed as separate arguments
            tags_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
            # print(tags_list)
            # Check if tags_list is empty
            print(f"Tags List: {tags_list}")
            if not tags_list:
                return JsonResponse({'status': 'error', 'message': 'Please enter the tag to filter'}, status=400)
            for tag in tags_list:
                # Check if the tag exists
                if not Tag.objects.filter(name=tag).exists():
                    return JsonResponse({'status': 'error', 'message': f'Tag not found: {tag}'}, status=404)

                # filtered_questions = filtered_questions.filter(tags__name=tag)
            # Retrieve questions filtered by tags
            filtered_questions = Question.objects.filter(tags__name__in=tags_list).distinct()

            # Prepare the data in the specified JSON format
            polls_data = []
            for question in filtered_questions:
                options_data = {}
                for choice in question.choice_set.all():
                    options_data[choice.choice_text] = choice.votes

                tag_names = [tag.name for tag in question.tags.all()]
                print(question.id);
                poll_data = {
                    "id": question.id, 
                    "Question": question.question_text,
                    "OptionVote": options_data,
                    "Tags": tag_names,
                }
                polls_data.append(poll_data)

            # Return the data as JSON response
            return JsonResponse(polls_data, safe=False, content_type="application/json")
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@require_GET
def get_polls_by_id(request, question_id):
    try:
        # Retrieve the question based on the provided ID
        question = Question.objects.get(pk=question_id)

        # Retrieve choices associated with the question
        choices = Choice.objects.filter(question=question)

        # Prepare the data in the specified JSON format
        poll_data = {
            "Question": question.question_text,
            "Choices": [{"ChoiceText": choice.choice_text, "Votes": choice.votes} for choice in choices],
            "Tags": [tag.name for tag in question.tags.all()],
        }

        return JsonResponse(poll_data, safe=False, content_type="application/json")

    except Question.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Question with ID {question_id} not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@require_GET
def get_all_tags(request):
    try:
        # Retrieve all tags from the database
        tags = Tag.objects.all()

        # Extract tag names from the queryset
        tag_names = [tag.name for tag in tags]

        return JsonResponse({'tags': tag_names}, safe=False, content_type="application/json")

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@ require_http_methods(["PUT"])
def increment_option_votes(request, question_id):
    try:
        payload = json.loads(request.body.decode('utf-8'))
        increment_option = payload.get('incrementOption', None)

        if increment_option is None:
            return JsonResponse({'status': 'error', 'message': 'Missing "incrementOption" in the payload'}, status=400)

        # Retrieve the choice based on the provided option text and associated with the question
        choice = Choice.objects.get(question_id=question_id, choice_text=increment_option)

        # Increment the votes for the chosen option
        choice.votes += 1
        choice.save()

        return JsonResponse({'status': 'success', 'message': f'Votes for option "{increment_option}" incremented successfully'})

    except Choice.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Option "{increment_option}" not found for the specified question'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by("-pub_date")[:5]

# def detail(request, question_id):
#     return HttpResponse("You're looking at question %s." % question_id)


class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"



def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))

class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"

