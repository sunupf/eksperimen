require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)

    wait.until { @driver.find_element(:css => '#activity-list li').displayed? }

    puts @driver.find_element(:css => '#activity-list li').displayed?

    target = @testCase['testCases']['target'].split("#")
    url = target.first
    id = url.gsub("http://todo.app/activity/","")

    puts url
    puts id

    begin
      element = @driver.find_element :css => "#activity-#{id} li"
      edit = @driver.find_element :css => "#activity-#{id} li a.edit"
    rescue
      element = @driver.find_element :css => "#activity-list>li:first-child"
      edit = @driver.find_element :css => "#activity-list>li:first-child>a.edit"
      # @driver.execute_script("arguments[0].setAttribute('href','#{url}')" , edit)
    end

    action = @driver.action
    action.move_to(element).move_to(edit).click().perform()

    wait.until {
      @driver.find_element(:css => '#update-activity .uk-modal-dialog').displayed?
    }

    wait.until {
      el = @driver.find_element(:css => '#update-activity .uk-modal-dialog #activity-title')
      text_value = @driver.execute_script("return arguments[0].value" , el)
      # puts text_value.empty?
      el if !text_value.empty?
    }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      if(key != "target")
        element = @driver.find_element :css => "#update-activity #{key}"
        if(key === "[name='due']")
          data = input.split "-"
          if(data.length === 3 || data.length === 0)
            element.clear
          end
        elsif
          element.clear
        end
        element.send_keys input
      end
    end

    form = @driver.find_element :css => "#update-activity .uk-modal-dialog form"
    @driver.execute_script("arguments[0].setAttribute('action','#{url}')" , form)


    buttonSubmit = @driver.find_element :css => "#update-activity .uk-button-primary"
    buttonSubmit.click

    wait.until { @driver.find_element :css => ".showSweetAlert.visible h2, #update-activity .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p" }

    respons = @driver.find_elements :css => ".showSweetAlert.visible h2, #update-activity .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p"

    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end

    expect = @testCase['messages']
    puts expect
    puts "////"
    puts result
    return Set.new(expect) === Set.new(result)
  end
end
