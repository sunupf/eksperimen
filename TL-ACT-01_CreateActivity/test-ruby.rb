require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '.container a.add.icon-action').displayed? }

    element = @driver.find_element(:css => '.container a.add.icon-action')
    element.click

    wait.until { @driver.find_element(:css => '#add-activity .uk-modal-dialog').displayed? }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      element = @driver.find_element :css => "#add-activity #{key}"
      if(key === "[name='todo_id']")
        @driver.execute_script("arguments[0].value='#{input}'" , element)
      else
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

    buttonSubmit = @driver.find_element :css => "#add-activity .uk-button-primary"
    buttonSubmit.click
    # #
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => ".showSweetAlert.visible h2, #add-activity .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p" }

    respons = @driver.find_elements :css => ".showSweetAlert.visible h2, #add-activity .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p"

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
